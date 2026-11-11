## Why the AWS bill jumped in October

**Short version:** October came to **$4,760**, up from **$2,110** in September. Almost all of the extra **$2,650** is NAT Gateway and CloudWatch, and both trace back to two changes made in the first week of October.

### Monthly totals

May $1,840 · June $1,910 · July $1,880 · August $2,020 · September $2,110 · October **$4,760**

### September → October by service

| Service | September | October | Change |
|---|---|---|---|
| NAT Gateway | $110 | $2,240 | +$2,130 |
| CloudWatch | $70 | $450 | +$380 |
| EC2 | $1,180 | $1,210 | +$30 |
| RDS | $430 | $435 | +$5 |
| S3 | $290 | $300 | +$10 |
| Other | $30 | $125 | +$95 |

### What happened

1. **Debug logging left on.** `log-shipper` v2.3, deployed Oct 3, runs with `LOG_LEVEL=debug`. Its output leaves the private subnets through the NAT Gateway: about **38 TB** in October. The same logs also go to CloudWatch Logs (~**760 GB** ingested at $0.50/GB ≈ **$380**).
2. **ECR endpoint deleted.** Terraform change #412 (Oct 6) removed the ECR VPC endpoints, so container image pulls now go through the NAT Gateway too: about **9 TB**.

NAT data processed went from **2.4 TB** to **49.8 TB**, at **$0.045/GB**.

### Fixes, in order

1. Set `LOG_LEVEL=info` on `log-shipper` and redeploy. Removes ~38 TB/month of NAT traffic and most of the CloudWatch ingestion.
2. Restore `aws_vpc_endpoint.ecr_api` and `aws_vpc_endpoint.ecr_dkr` in Terraform. Costs about **$29/month** (2 interface endpoints × 2 AZs) and saves roughly **$400/month** in NAT processing.
3. Set CloudWatch log retention to **14 days** (currently "Never expire").
4. Add a billing alarm at **$2,500**.

If 1 and 2 are done by **Nov 5**, November should land around **$2,150**.

### Not verified

- Cost Explorer figures for Oct 28–31 are still estimates.
- I didn't check Savings Plan coverage for EC2.
- The "Other" increase (+$95) isn't explained yet.
