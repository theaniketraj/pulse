terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro" # Free tier eligible
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access Prometheus"
  type        = list(string)
  default     = ["0.0.0.0/0"] # WARNING: Open to world - restrict in production
}

# Data source for latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group
resource "aws_security_group" "vitals_demo" {
  name        = "vitals-demo-sg"
  description = "Security group for Vitals Demo Prometheus"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "SSH access"
  }

  # HTTP access (Nginx reverse proxy)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS access (for future SSL)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Prometheus (optional - can remove if using Nginx proxy)
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "Prometheus UI"
  }

  # Demo app metrics (optional - can remove if not needed externally)
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "Demo app metrics"
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name        = "vitals-demo-sg"
    Project     = "Vitals"
    Environment = "demo"
  }
}

# Elastic IP for static public IP
resource "aws_eip" "vitals_demo" {
  instance = aws_instance.vitals_demo.id
  domain   = "vpc"

  tags = {
    Name        = "vitals-demo-eip"
    Project     = "Vitals"
    Environment = "demo"
  }
}

# EC2 Instance
resource "aws_instance" "vitals_demo" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.vitals_demo.id]

  # User data script to set up Docker and Prometheus
  user_data = file("${path.module}/../ec2-user-data.sh")

  # EBS volume (Free tier: 30 GB)
  root_block_device {
    volume_size           = 20 # GB - enough for Prometheus + Docker images
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  # Enable detailed monitoring (optional, costs extra)
  monitoring = false

  tags = {
    Name        = "vitals-demo-prometheus"
    Project     = "Vitals"
    Environment = "demo"
  }

  # Lifecycle
  lifecycle {
    ignore_changes = [
      ami # Prevent replacement when AMI updates
    ]
  }
}

# Outputs
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.vitals_demo.id
}

output "public_ip" {
  description = "Public IP address (Elastic IP)"
  value       = aws_eip.vitals_demo.public_ip
}

output "public_dns" {
  description = "Public DNS name"
  value       = aws_instance.vitals_demo.public_dns
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://${aws_eip.vitals_demo.public_ip}"
}

output "prometheus_ui_url" {
  description = "Prometheus UI URL (direct access)"
  value       = "http://${aws_eip.vitals_demo.public_ip}:9090"
}

output "demo_app_metrics_url" {
  description = "Demo app metrics URL"
  value       = "http://${aws_eip.vitals_demo.public_ip}:3001/metrics"
}

output "ssh_command" {
  description = "SSH command to connect to instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ec2-user@${aws_eip.vitals_demo.public_ip}"
}
