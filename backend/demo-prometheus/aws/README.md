# AWS Deployment for Vitals Demo Prometheus

This directory contains infrastructure-as-code for deploying the Vitals demo Prometheus instance to AWS EC2.

## Prerequisites

- AWS Account with free tier eligibility
- AWS CLI configured (`aws configure`)
- Terraform installed (>= 1.0)
- SSH key pair created in AWS

## Quick Deploy

### 1. Create SSH Key Pair (if you don't have one)

```bash
# Create key pair in AWS
aws ec2 create-key-pair \
  --key-name vitals-demo \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/vitals-demo.pem

chmod 400 ~/.ssh/vitals-demo.pem
```

### 2. Deploy with Terraform

```bash
cd aws/terraform

# Initialize Terraform
terraform init

# Review deployment plan
terraform plan -var="key_name=vitals-demo"

# Deploy (will take 3-5 minutes)
terraform apply -var="key_name=vitals-demo"
```

### 3. Get Prometheus URL

```bash
# Terraform will output the URL after deployment
terraform output prometheus_url

# Example output: http://3.123.45.67
```

### 4. Verify Deployment

```bash
# SSH into instance
terraform output -raw ssh_command | bash

# Check Docker containers
sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml ps

# Check logs
sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml logs -f
```

## Manual Deployment (Without Terraform)

If you prefer to deploy manually via AWS Console:

### 1. Launch EC2 Instance

1. Go to EC2 Console → Launch Instance
2. **Name**: `vitals-demo-prometheus`
3. **AMI**: Amazon Linux 2023
4. **Instance type**: `t2.micro` (free tier)
5. **Key pair**: Select or create one
6. **Network settings**:
   - Allow HTTP (80)
   - Allow HTTPS (443)
   - Allow SSH (22) from your IP
   - Allow custom TCP 9090 (Prometheus)
7. **Storage**: 20 GB gp3
8. **Advanced details** → **User data**: Copy contents of `../ec2-user-data.sh`
9. Click **Launch Instance**

### 2. Allocate Elastic IP

1. Go to EC2 → Elastic IPs → Allocate
2. Associate with your instance
3. Note the public IP address

### 3. Wait for Setup

The user data script takes ~3-5 minutes to:

- Install Docker
- Download images
- Start Prometheus + demo app
- Configure Nginx

### 4. Test Access

```bash
# Replace with your Elastic IP
curl http://YOUR_ELASTIC_IP/api/v1/query?query=up

# Should return JSON with status: success
```

## Architecture

```bash
┌─────────────────────────────────────┐
│         AWS EC2 t2.micro            │
│                                     │
│  ┌──────────┐      ┌──────────┐     │
│  │  Nginx   │      │ Docker   │     │
│  │  :80     │──────│ Compose  │     │
│  └──────────┘      └──────────┘     │
│       │                  │          │
│       │            ┌─────▼──────┐   │
│       │            │ Prometheus │   │
│       │            │   :9090    │   │
│       │            └─────┬──────┘   │
│       │                  │          │
│       │            ┌─────▼──────┐   │
│       │            │  Demo App  │   │
│       │            │   :3001    │   │
│       │            └────────────┘   │
│       │                             │
└───────┼─────────────────────────────┘
        │
        ▼
   Internet (Port 80)
```

## Resource Costs

### Free Tier (First 12 Months)

- **EC2 t2.micro**: 750 hours/month FREE
- **EBS Storage**: 30 GB FREE
- **Data Transfer**: 15 GB/month FREE
- **Elastic IP**: FREE when attached

### After Free Tier

- **EC2 t2.micro**: ~$8.50/month
- **EBS 20 GB**: ~$2/month
- **Total**: ~$10.50/month

### Cost Optimization

- Stop instance when not in use: $0/month (only pay for EBS)
- Use spot instances: ~$2.50/month (70% savings)
- Use Lightsail: $3.50/month (predictable pricing)

## Configuration

### Prometheus Settings

Edit `/opt/vitals-demo/prometheus.aws.yml` on the instance:

```yaml
global:
  scrape_interval: 15s     # How often to scrape
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'demo-app'
    static_configs:
      - targets: ['demo-app:3001']
```

Reload config:

```bash
curl -X POST http://localhost:9090/-/reload
```

### Retention Period

Default: 7 days. To change:

Edit `/opt/vitals-demo/docker-compose.aws.yml`:

```yaml
services:
  prometheus:
    command:
      - "--storage.tsdb.retention.time=14d"  # Change to 14 days
```

Restart:

```bash
sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml restart prometheus
```

## Security

### Current Setup (Development)

- ⚠️ Prometheus open to internet (0.0.0.0/0)
- ⚠️ No authentication
- ⚠️ HTTP only (no SSL)

### Production Recommendations

1. **Restrict Access**:
   - Update security group to allow only specific IPs
   - Or use VPN/bastion host

2. **Enable Authentication**:

   ```yaml
   # prometheus.aws.yml
   basic_auth_users:
     admin: $2y$10$hashed_password
   ```

3. **Enable HTTPS**:

   ```bash
   # Install certbot
   sudo yum install -y certbot python3-certbot-nginx
   
   # Get certificate (requires domain name)
   sudo certbot --nginx -d demo.yourdomain.com
   ```

4. **Enable Firewall**:

   ```bash
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

## Monitoring

### CloudWatch Alarms (Optional)

Create alarms for:

- High CPU usage (> 80%)
- Low disk space (< 10% free)
- Instance status checks

### Health Checks

```bash
# Prometheus health
curl http://YOUR_IP/-/healthy

# Demo app health  
curl http://YOUR_IP:3001/health

# Check targets
curl http://YOUR_IP/api/v1/targets
```

## Troubleshooting

### Services not starting

```bash
# SSH into instance
ssh -i ~/.ssh/vitals-demo.pem ec2-user@YOUR_IP

# Check user data script logs
sudo cat /var/log/cloud-init-output.log

# Check Docker status
sudo systemctl status docker

# Check container logs
sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml logs
```

### Prometheus UI not accessible

```bash
# Check if Prometheus is running
sudo docker ps | grep prometheus

# Check Nginx status
sudo systemctl status nginx

# Check security group allows port 80
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

### High costs

```bash
# Stop instance when not needed
aws ec2 stop-instances --instance-ids i-xxxxx

# Start when needed
aws ec2 start-instances --instance-ids i-xxxxx

# Or terminate completely
terraform destroy
```

## Cleanup

### Remove All Resources

```bash
# Using Terraform
terraform destroy -var="key_name=vitals-demo"

# Manual cleanup
# 1. Terminate EC2 instance
# 2. Release Elastic IP
# 3. Delete security group
# 4. Delete EBS snapshots (if any)
```

## Next Steps

1. ✅ Deploy to AWS EC2
2. ⬜ Configure domain name (optional)
3. ⬜ Enable HTTPS with Let's Encrypt
4. ⬜ Update VS Code extension to use AWS URL
5. ⬜ Add authentication (if needed)
6. ⬜ Set up monitoring/alerts

## Support

- **Issues**: <https://github.com/theaniketraj/vitals/issues>
- **Docs**: <https://github.com/theaniketraj/vitals/blob/main/PROMETHEUS_SETUP.md>
