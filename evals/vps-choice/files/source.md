## Which VPS for the media server?

You asked for something that can run the stack (Jellyfin, the subtitle worker and Postgres) with hardware transcoding off, for under $40/month, in Europe.

**Recommendation:** Kestrel KS-8. It's the only option under budget with enough RAM for Postgres plus two parallel software transcodes, and its bandwidth is unmetered.

### The four I looked at

**Kestrel KS-8** costs $34/month. It has 8 dedicated vCPUs (AMD EPYC), 16 GB RAM and 240 GB NVMe, with unmetered 1 Gbit/s bandwidth, in Falkenstein, Germany. Snapshots cost $0.012/GB/month. In the trial, software transcoding of two 1080p streams held at about 70 % CPU.

**Northbeam NB-Pro** costs $28/month. It has 4 shared vCPUs, 8 GB RAM and 160 GB SSD, with 4 TB of traffic included and $1.20/TB after that, in Amsterdam. Because the vCPUs are shared, transcoding speed varies: the trial dropped to 0.8× realtime during peak hours.

**Corvid C4** costs $42/month, which is over budget. It has 6 dedicated vCPUs, 32 GB RAM and 400 GB NVMe, with 20 TB of traffic included, in Frankfurt. It has the best specs, but it's $8 over the limit, and that price needs a 12-month contract ($55 month-to-month).

**Tidewater Free ARM** costs $0. It has 4 ARM cores, 24 GB RAM, 200 GB block storage and 10 TB egress, in Stockholm. It's free, but capacity in that region is often unavailable (3 failed attempts this week), and ARM builds of the subtitle worker aren't tested yet.

### Why not the others

- Northbeam: 8 GB RAM is tight with Postgres, and traffic overage could add $5–10/month at your current ~8 TB/month.
- Corvid: over budget unless you commit to 12 months.
- Tidewater: you can't count on getting capacity, and it's untested on ARM.

### Before you buy

- Kestrel's 16 GB is enough today (Postgres uses ~3.5 GB and Jellyfin ~2 GB), but it leaves little room if you add a second library server.
- I haven't checked whether Kestrel supports IPv6, which you said you need for the tracker.
