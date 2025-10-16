# Terraform Starters — Vercel, Postgres+pgvector, Redis, S3, ECS (Patched)

Copy‑ready modules and env wiring with **clean outputs** (subnets/SGs), **ECR repos**, and **ecs‑service** inputs that line up with CI.

> Layout assumes `infra/terraform/` with `envs/{dev,prod}` and `modules/*`.

---

## 0) Providers & Backend (envs/\*/main.tf header)

```hcl
terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws    = { source = "hashicorp/aws",   version = ">= 5.0" }
    vercel = { source = "vercel/vercel",   version = ">= 0.15.0" }
  }
  backend "s3" {
    bucket         = "galaxyco-terraform-state"
    key            = "dev/terraform.tfstate"    # change per env
    region         = "us-east-1"
    dynamodb_table = "galaxyco-terraform-locks"
    encrypt        = true
  }
}

provider "aws"    { region = var.aws_region }
provider "vercel" { token  = var.vercel_token }
```

### env vars (envs/\*/variables.tf)

```hcl
variable "aws_region"    { type = string }
variable "project"       { type = string }
variable "vercel_token"  { type = string, sensitive = true }
variable "db_username"   { type = string }
variable "db_password"   { type = string, sensitive = true }
```

### sample tfvars (envs/dev/terraform.tfvars.example)

```hcl
aws_region   = "us-east-1"
project      = "galaxyco"
vercel_token = "VERCEL_TOKEN_HERE"
db_username  = "galaxy"
db_password  = "change-me"
```

---

## 1) Module: network (VPC, subnets, SGs)

`modules/network/main.tf`

```hcl
resource "aws_vpc" "this" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "${var.project}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
}

# Subnets
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.101.0/24"
  availability_zone = "us-east-1a"
}

# NAT (simple, single‑AZ for starter)
resource "aws_eip" "nat" { domain = "vpc" }
resource "aws_nat_gateway" "nat" {
  subnet_id     = aws_subnet.public_a.id
  allocation_id = aws_eip.nat.id
}

# Route tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route { cidr_block = "0.0.0.0/0" gateway_id = aws_internet_gateway.igw.id }
}
resource "aws_route_table_association" "pub_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  route { cidr_block = "0.0.0.0/0" nat_gateway_id = aws_nat_gateway.nat.id }
}
resource "aws_route_table_association" "priv_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

# Security Groups
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-ecs-tasks"
  description = "Allow app traffic"
  vpc_id      = aws_vpc.this.id
  egress { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

variable "project" { type = string }
```

`modules/network/outputs.tf`

```hcl
output "vpc_id"         { value = aws_vpc.this.id }
output "public_a_id"    { value = aws_subnet.public_a.id }
output "private_a_id"   { value = aws_subnet.private_a.id }
output "ecs_tasks_sg"   { value = aws_security_group.ecs_tasks.id }
```

---

## 2) Module: rds-postgres (pgvector‑ready)

`modules/rds-postgres/main.tf`

```hcl
variable "project"    { type = string }
variable "subnet_ids" { type = list(string) }
variable "db_username"{ type = string }
variable "db_password"{ type = string, sensitive = true }

resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-db"
  subnet_ids = var.subnet_ids
}

resource "aws_db_parameter_group" "pg" {
  name   = "${var.project}-pg"
  family = "postgres15"
  parameter { name = "shared_preload_libraries" value = "vector" }
}

resource "aws_db_instance" "this" {
  identifier           = "${var.project}-pg"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t4g.medium"
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.this.name
  parameter_group_name = aws_db_parameter_group.pg.name
  allocated_storage    = 50
  publicly_accessible  = false
  skip_final_snapshot  = true
}

output "postgres_url" {
  value     = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.this.address}:5432/${var.project}"
  sensitive = true
}
```

---

## 3) Module: elasticache-redis

`modules/elasticache-redis/main.tf`

```hcl
variable "project"    { type = string }
variable "subnet_ids" { type = list(string) }

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.project}-redis"
  subnet_ids = var.subnet_ids
}

resource "aws_elasticache_cluster" "this" {
  cluster_id        = "${var.project}-redis"
  engine            = "redis"
  node_type         = "cache.t3.micro"
  num_cache_nodes   = 1
  subnet_group_name = aws_elasticache_subnet_group.this.name
}

output "redis_endpoint" { value = aws_elasticache_cluster.this.cache_nodes[0].address }
```

---

## 4) Module: s3-bucket (artifacts)

`modules/s3-bucket/main.tf`

```hcl
variable "project" { type = string }

resource "aws_s3_bucket" "this" { bucket = "${var.project}-artifacts" }
resource "aws_s3_bucket_versioning" "v" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration { status = "Enabled" }
}

output "bucket" { value = aws_s3_bucket.this.bucket }
```

---

## 5) Module: ecr-repos (API & Agents)

`modules/ecr-repos/main.tf`

```hcl
variable "project" { type = string }

resource "aws_ecr_repository" "api" {
  name                 = "${var.project}-api"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

resource "aws_ecr_repository" "agents" {
  name                 = "${var.project}-agents"
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

output "api_repo_url"    { value = aws_ecr_repository.api.repository_url }
output "agents_repo_url" { value = aws_ecr_repository.agents.repository_url }
```

---

## 6) Module: ecs-service (agents workers)

`modules/ecs-service/main.tf`

```hcl
variable "project"       { type = string }
variable "cluster_name"  { type = string }
variable "subnet_ids"    { type = list(string) }
variable "sg_id"         { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn"      { type = string }
variable "image"         { type = string }   # ECR URI with tag
variable "container_port"{ type = number, default = 5001 }
variable "env"           { type = map(string), default = {} }

resource "aws_ecs_cluster" "this" { name = var.cluster_name }

resource "aws_ecs_task_definition" "task" {
  family                   = "${var.project}-agents"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  container_definitions    = jsonencode([
    {
      name         = "agents",
      image        = var.image,
      essential    = true,
      portMappings = [{ containerPort = var.container_port }],
      environment  = [for k, v in var.env : { name = k, value = v }]
    }
  ])
}

resource "aws_ecs_service" "svc" {
  name            = "${var.project}-agents"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.sg_id]
    assign_public_ip = false
  }
}

output "cluster_id" { value = aws_ecs_cluster.this.id }
output "service_arn" { value = aws_ecs_service.svc.arn }
```

> IAM roles (`execution_role_arn`, `task_role_arn`) can be created via your policy module or AWS console; keep least‑privilege.

---

## 7) Env wiring (envs/dev/main.tf body)

```hcl
module "network" {
  source  = "../modules/network"
  project = var.project
}

module "repos" {
  source  = "../modules/ecr-repos"
  project = var.project
}

module "postgres" {
  source      = "../modules/rds-postgres"
  project     = var.project
  subnet_ids  = [module.network.private_a_id]
  db_username = var.db_username
  db_password = var.db_password
}

module "redis" {
  source     = "../modules/elasticache-redis"
  project    = var.project
  subnet_ids = [module.network.private_a_id]
}

module "artifacts" {
  source  = "../modules/s3-bucket"
  project = var.project
}

# Example: deploy agents once CI produces an image tag
# module "agents" {
#   source            = "../modules/ecs-service"
#   project           = var.project
#   cluster_name      = "${var.project}-cluster"
#   subnet_ids        = [module.network.private_a_id]
#   sg_id             = module.network.ecs_tasks_sg
#   execution_role_arn = "arn:aws:iam::123456789012:role/ecsExecutionRole"
#   task_role_arn      = "arn:aws:iam::123456789012:role/ecsTaskRole"
#   image             = "${module.repos.agents_repo_url}:sha-abc1234" # from CI output
#   env = {
#     DATABASE_URL = "${module.postgres.postgres_url}"
#     REDIS_URL    = module.redis.redis_endpoint
#   }
# }
```

---

## 8) Commands

```bash
cd infra/terraform/envs/dev
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

---

## 9) Notes

- **Outputs fixed**: `private_a_id`, `public_a_id`, `ecs_tasks_sg` now exported from `network`.
- **ECR repos** provided for `api` and `agents` to match CI image pushes.
- **ecs-service** module expects **image URI + tag** from CI, and **IAM role ARNs**.
- For early dev, you can swap RDS with Neon; keep the interface (URL) identical to avoid app changes.
- Vercel resources are usually easier to create in the UI; provider left optional.
