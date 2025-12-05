# Vitals Demo Prometheus Setup

This directory contains a complete Prometheus demo environment for testing and deployment.

## Local Development

### Prerequisites

- Docker and Docker Compose installed
- Ports 9090, 3001, 9100, 6379, 9121, 5432, 9187, 3000 available

### Quick Start

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Access Points

- **Prometheus UI**: <http://localhost:9090>
- **Demo App Metrics**: <http://localhost:3001/metrics>
- **Demo App Health**: <http://localhost:3001/health>
- **Node Exporter Metrics**: <http://localhost:9100/metrics>
- **Redis Exporter Metrics**: <http://localhost:9121/metrics>
- **PostgreSQL Exporter Metrics**: <http://localhost:9187/metrics>
- **Grafana**: <http://localhost:3000> (admin/admin)

## Architecture

```bash
┌─────────────────┐
│   Prometheus    │◄─────┐
│   (port 9090)   │      │
└─────────────────┘      │
         ▲               │
         │ scrapes       │
         │               │
    ┌────┴────┬──────────┼──────────┬─────────┐
    │         │          │          │         │
┌───▼──┐  ┌──▼───┐  ┌───▼────┐  ┌──▼──┐  ┌──▼────┐
│ Demo │  │ Node │  │ Redis  │  │ PG  │  │ Prom  │
│ App  │  │ Exp  │  │ Exp    │  │ Exp │  │ Self  │
│ 3001 │  │ 9100 │  │ 9121   │  │ 9187│  │ 9090  │
└──────┘  └──────┘  └────────┘  └─────┘  └───────┘
```

## Services

### Prometheus (port 9090)

- **Image**: prom/prometheus:latest
- **Purpose**: Main metrics aggregator
- **Config**: `prometheus.yml`
- **Retention**: 15 days

### Demo App (port 3001)

- **Image**: node:18-alpine
- **Purpose**: Generate realistic application metrics
- **Metrics**: HTTP requests, cache hits/misses, errors, latency
- **Endpoints**:
  - `/metrics` - Prometheus metrics
  - `/health` - Health check
  - `/api/users` - Demo endpoint with cache simulation
  - `/api/data` - Demo endpoint with error simulation
  - `/api/process` - Demo endpoint with latency simulation

### Node Exporter (port 9100)

- **Image**: prom/node-exporter:latest
- **Purpose**: System-level metrics (CPU, memory, disk, network)

### Redis (port 6379) + Exporter (port 9121)

- **Images**: redis:alpine, oliver006/redis_exporter:latest
- **Purpose**: Cache metrics simulation

### PostgreSQL (port 5432) + Exporter (port 9187)

- **Images**: postgres:15-alpine, prometheuscommunity/postgres-exporter:latest
- **Purpose**: Database metrics simulation
- **Credentials**: postgres/postgres

### Grafana (port 3000)

- **Image**: grafana/grafana:latest
- **Purpose**: Visualization and dashboards
- **Credentials**: admin/admin

## Metrics Available

### Application Metrics (Demo App)

- `http_request_duration_ms` - HTTP request latency
- `http_requests_total` - Total HTTP requests
- `active_connections` - Active connections
- `cache_hits_total` - Cache hit count
- `cache_misses_total` - Cache miss count
- `errors_total` - Error count by type

### System Metrics (Node Exporter)

- `node_cpu_seconds_total` - CPU usage
- `node_memory_MemAvailable_bytes` - Available memory
- `node_disk_io_time_seconds_total` - Disk I/O
- `node_network_receive_bytes_total` - Network RX
- `node_network_transmit_bytes_total` - Network TX

### Redis Metrics

- `redis_connected_clients` - Connected clients
- `redis_used_memory_bytes` - Memory usage
- `redis_commands_processed_total` - Commands processed

### PostgreSQL Metrics

- `pg_up` - Database status
- `pg_stat_database_tup_fetched` - Rows fetched
- `pg_stat_database_tup_inserted` - Rows inserted
- `pg_stat_database_conflicts` - Database conflicts

## Example Queries

### Application Performance

```promql
# Request rate (req/sec)
rate(http_requests_total[5m])

# Average latency
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))

# Cache hit ratio
sum(rate(cache_hits_total[5m])) / (sum(rate(cache_hits_total[5m])) + sum(rate(cache_misses_total[5m])))

# Error rate
rate(errors_total[5m])
```

### System Resources

```promql
# CPU usage percentage
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100
```

## AWS Deployment

### Option 1: ECS Fargate (Recommended)

```bash
# Build and push images to ECR
aws ecr create-repository --repository-name vitals-prometheus
aws ecr create-repository --repository-name vitals-demo-app

# Tag and push
docker tag prom/prometheus:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vitals-prometheus:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vitals-prometheus:latest

docker build -t vitals-demo-app ./demo-app
docker tag vitals-demo-app <account-id>.dkr.ecr.us-east-1.amazonaws.com/vitals-demo-app:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vitals-demo-app:latest

# Create ECS cluster
aws ecs create-cluster --cluster-name vitals-demo

# Create task definitions and services
# (Use AWS Console or Terraform for full setup)
```

### Option 2: EC2 with Docker Compose (Free Tier)

```bash
# Launch t2.micro instance
# Install Docker and Docker Compose
# Clone repository
# Run docker-compose up -d
# Configure ALB with SSL
```

## Cost Estimation (AWS)

### Free Tier Eligible

- **ECS Fargate**: 20 GB-Hours free per month
- **Application Load Balancer**: First year free (750 hours)
- **Data Transfer**: 1 GB/month free

### Minimal Cost Option

- **t2.micro EC2**: Free tier (750 hours/month)
- **5 GB EBS**: Free tier
- **Estimated**: $0-$5/month after free tier

## Security

- [ ] Enable HTTPS with ACM certificate
- [ ] Restrict Prometheus UI to read-only
- [ ] Use security groups to limit access
- [ ] Rotate database credentials
- [ ] Enable CloudWatch logging

## Monitoring

- Prometheus scrape targets: <http://localhost:9090/targets>
- Service health: `docker-compose ps`
- Logs: `docker-compose logs -f [service-name]`

## Troubleshooting

### Prometheus not scraping targets

```bash
# Check Prometheus logs
docker-compose logs prometheus

# Verify network connectivity
docker-compose exec prometheus wget -O- http://demo-app:3001/metrics
```

### Demo app not starting

```bash
# Check logs
docker-compose logs demo-app

# Verify dependencies installed
docker-compose exec demo-app npm list
```

### Database connection issues

```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U postgres -c '\l'

# Test Redis connection
docker-compose exec redis redis-cli ping
```

## Cleanup

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (data will be lost)
docker-compose down -v

# Remove unused images
docker image prune -a
```

## Next Steps

1. **Test locally**: `docker-compose up -d` and verify all metrics
2. **Deploy to AWS**: Choose ECS or EC2 deployment method
3. **Update extension**: Change default `prometheusUrl` to AWS-hosted demo
4. **Add documentation**: Update PROMETHEUS_SETUP.md with demo info
5. **Monitor costs**: Set up billing alerts in AWS
