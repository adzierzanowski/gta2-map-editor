<script lang="ts">
  const p = [32, 0]
  const q = [0, 40]

  const a = [p[0], p[1] + 64]
  const b = [q[0], q[1] + 64]
  const c = [b[0] + 64, b[1]]
  const d = [a[0] + 64, a[1]]
  const r = [q[0] + 64, q[1]]
  const s = [p[0] + 64, p[1]]

  const p1 = [p[0], p[1] + 56]
  const q1 = [q[0], q[1] + 56]
  const r1 = [r[0], r[1] + 56]
  const s1 = [s[0], s[1] + 56]

  const p2 = [p[0], p[1] + 48]
  const q2 = [q[0], q[1] + 48]
  const r2 = [r[0], r[1] + 48]
  const s2 = [s[0], s[1] + 48]

  const p3 = [p[0], p[1] + 40]
  const q3 = [q[0], q[1] + 40]
  const r3 = [r[0], r[1] + 40]
  const s3 = [s[0], s[1] + 40]

  const p4 = [p[0], p[1] + 32]
  const q4 = [q[0], q[1] + 32]
  const r4 = [r[0], r[1] + 32]
  const s4 = [s[0], s[1] + 32]

  const p5 = [p[0], p[1] + 24]
  const q5 = [q[0], q[1] + 24]
  const r5 = [r[0], r[1] + 24]
  const s5 = [s[0], s[1] + 24]

  const p6 = [p[0], p[1] + 16]
  const q6 = [q[0], q[1] + 16]
  const r6 = [r[0], r[1] + 16]
  const s6 = [s[0], s[1] + 16]

  const p7 = [p[0], p[1] + 8]
  const q7 = [q[0], q[1] + 8]
  const r7 = [r[0], r[1] + 8]
  const s7 = [s[0], s[1] + 8]

  const pm = [p[0] + 8, p[1] + 12]
  const qm = [p[0], p[1] + 20]
  const rm = [qm[0] + 24, qm[1]]
  const sm = [pm[0] + 24, pm[1]]
  const am = [pm[0], pm[1] + 64]
  const bm = [qm[0], qm[1] + 64]
  const cm = [rm[0], rm[1] + 64]
  const dm = [sm[0], sm[1] + 64]

  const ps = [p[0] + 24, p[1]]
  const pr = [p[0] + 18, p[1] + 6]
  const pq = [p[0] - 6, p[1] + 6]

  const sp = [p[0] + 40, p[1]]
  const sr = [pr[0] + 40, pr[1]]
  const sq = [pq[0] + 40, pq[1]]

  const qp = [q[0] + 6, q[1] - 6]
  const qr = [q[0] + 24, q[1]]
  const qs = [q[0] + 30, q[1] - 6]

  const rp = [qp[0] + 40, qp[1]]
  const rq = [q[0] + 40, q[1]]
  const rs = [qs[0] + 40, qs[1]]

  const ab = [pq[0], pq[1] + 64]
  const ac = [pr[0], pr[1] + 64]
  const ad = [ps[0], ps[1] + 64]

  const ba = [qp[0], qp[1] + 64]
  const bc = [qr[0], qr[1] + 64]
  const bd = [qs[0], qs[1] + 64]

  const ca = [rp[0], rp[1] + 64]
  const cb = [rq[0], rq[1] + 64]
  const cd = [rs[0], rs[1] + 64]

  const da = [sp[0], sp[1] + 64]
  const db = [sq[0], sq[1] + 64]
  const dc = [sr[0], sr[1] + 64]

  const lids = [
    [p, q, r, s],
    [p4, b, c, s4],
    [p, q4, r4, s],
    [a, q4, r4, d],
    [p4, q, r, s4],
    [p4, q4, c, d],
    [p, q, r4, s4],
    [a, b, r4, s4],
    [p4, q4, r, s],
    [b, c, s1, p1],
    [q1, r1, s2, p2],
    [q2, r2, s3, p3],
    [q3, r3, s4, p4],
    [q4, r4, s5, p5],
    [q5, r5, s6, p6],
    [q6, r6, s7, p7],
    [q7, r7, s, p],

    [q1, r1, d, a],
    [q2, r2, s1, p1],
    [q3, r3, s2, p2],
    [q4, r4, s3, p3],
    [q5, r5, s4, p4],
    [q6, r6, s5, p5],
    [q7, r7, s6, p6],
    [q, r, s7, p7],
    [p1, q1, c, d],
    [p2, q2, r1, s1],
    [p3, q3, r2, s2],
    [p4, q4, r3, s3],
    [p5, q5, r4, s4],
    [p6, q6, r5, s5],
    [p7, q7, r6, s6],
    [p, q, r7, s7],
    [a, b, r1, s1],
    [p1, q1, r2, s2],
    [p2, q2, r3, s3],
    [p3, q3, r4, s4],
    [p4, q4, r5, s5],
    [p5, q5, r6, s6],
    [p6, q6, r7, s7],
    [p7, q7, r, s],
    [p, b, c, s],
    [q, r, d, a],
    [p, q, c, d],
    [a, b, r, s],
    [q, r, s],
    [p, q, r],
    [s, p, r],
    [p, q, s],
    [r, b, d],
    [a, q, c],
    [a, s, c],
    [p, b, d],
    [p, q, qr, ps],
    [s, r, rq, sp],
    [p, s, sr, pq],
    [q, r, rs, qp],
    [p, ps, pr, pq],
    [sp, s, sr, sq],
    [r, rs, rp, rq],
    [q, qp, qs, qr],
    [pm, sm, rm, qm],
  ]
  const bottoms = [
    [q, b, c, r],
    [],
    [q4, b, c, r4],
    [q4, b, c, r4],
    [q, b, c, r],
    [q4, b, c],
    [q, b, c, r4],
    [b, c, r4],
    [q4, b, c, r],
    [],
    [q1, r1, c, b],
    [q2, r2, c, b],
    [q3, r3, c, b],
    [q4, r4, c, b],
    [q5, r5, c, b],
    [q6, r6, c, b],
    [q7, r7, c, b],
    [q1, r1, c, b],
    [q2, r2, c, b],
    [q3, r3, c, b],
    [q4, r4, c, b],
    [q5, r5, c, b],
    [q6, r6, c, b],
    [q7, r7, c, b],
    [q, r, c, b],
    [q1, b, c],
    [q2, b, c, r1],
    [q3, b, c, r2],
    [q4, b, c, r3],
    [q5, b, c, r4],
    [q6, b, c, r5],
    [q7, b, c, r6],
    [q, b, c, r7],
    [r1, c, b],
    [r2, c, b, q1],
    [r3, c, b, q2],
    [r4, c, b, q3],
    [r5, c, b, q4],
    [r6, c, b, q5],
    [r7, c, b, q6],
    [r, c, b, q7],
    [],
    [q, r, c, b],
    [q, b, c],
    [b, c, r],
    [q, r, c, b],
    [q, r, c, b],
    [p, a, c, r],
    [],
    [b, c, r],
    [q, b, c],
    [],
    [],
    [q, b, bc, qr],
    [rq, cb, c, r],
    [pq, ab, dc, sr],
    [q, b, c, r],
    [pq, pr, ac, ab],
    [sq, sr, dc, db],
    [rq, cb, c, r],
    [q, qr, bc, b],
    [qm, rm, cm, bm],
  ]
  const rights = [
    [r, c, d, s],
    [s4, c, d],
    [s, d, c, r4],
    [r4, c, d],
    [r, c, d, s4],
    [],
    [s4, r4, c, d],
    [r4, c, d, s4],
    [r, c, d, s],
    [c, d, s1],
    [c, d, s2, r1],
    [c, d, s3, r2],
    [c, d, s4, r3],
    [c, d, s5, r4],
    [c, d, s6, r5],
    [c, d, s7, r6],
    [c, d, s, r7],
    [r1, c, d],
    [r2, s1, d, c],
    [r3, s2, d, c],
    [r4, s3, d, c],
    [r5, s4, d, c],
    [r6, s5, d, c],
    [r7, s6, d, c],
    [r, s7, d, c],
    [],
    [s1, r1, c, d],
    [s2, r2, c, d],
    [s3, r3, c, d],
    [s4, r4, c, d],
    [s5, r5, c, d],
    [s6, r6, c, d],
    [s7, r7, c, d],
    [s1, r1, c, d],
    [s2, r2, c, d],
    [s3, r3, c, d],
    [s4, r4, c, d],
    [s5, r5, c, d],
    [s6, r6, c, d],
    [s7, r7, c, d],
    [s, r, c, d],
    [c, d, s],
    [r, d, c],
    [],
    [r, c, d, s],
    [r, s, d, c],
    [],
    [r, s, d, c],
    [q, s, d, b],
    [r, c, d],
    [],
    [c, d, s],
    [],
    [bc, qr, ps, ad],
    [r, c, d, s],
    [s, d, dc, sr],
    [r, c, cd, rs],
    [ps, ad, ac, pr],
    [s, d, dc, sr],
    [r, c, cd, rs],
    [qr, bc, bd, qs],
    [rm, sm, dm, cm],
  ]

  const { slope, width = 64 }: { slope: number; width: number } = $props()
  let lid = $derived(
    (lids[slope] ?? [])
      .map((x, i) => (i === 0 ? `M${x.join(' ')}` : `L${x.join(' ')}`))
      .join(' ') + 'z',
  )
  let bottom = $derived(
    (bottoms[slope] ?? [])
      .map((x, i) => (i === 0 ? `M${x.join(' ')}` : `L${x.join(' ')}`))
      .join(' ') + 'z',
  )
  let right = $derived(
    (rights[slope] ?? [])
      .map((x, i) => (i === 0 ? `M${x.join(' ')}` : `L${x.join(' ')}`))
      .join(' ') + 'z',
  )
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 128 128"
  stroke-linecap="round"
  stroke-linejoin="round"
  {width}>
  <g transform="translate(16,12)">
    <g>
      <!-- <path d={top} class="face top" /> -->
      <!-- <path d={left} class="face left" /> -->
      <path
        d={`M${p} L${s} L${d} L${a}z M${b} L${a}`}
        fill="none"
        class="box back" />
      <path d={right} class="face right" />
      <path d={bottom} class="face bottom" />
      <path d={lid} class="face lid" />
      <path d={`M${q} L${p} L${s}`} fill="none" class="box mid" />
      <path
        d={`M${q} L${r} L${c} L${b}z M${r} L${s}z M${c} L${d} L${s}`}
        fill="none"
        class="box front" />
    </g>
  </g>
</svg>

<style lang="scss">
  svg {
    .lid {
      fill: #00f;
      stroke: #0ff;
    }
    .top {
      fill: #0ff;
    }
    .bottom {
      fill: #0a0;
      stroke: lime;
    }
    .left {
      fill: #f0f;
    }
    .right {
      fill: #aa0;
      stroke: #ff0;
    }
    .face {
      fill-opacity: 0.2;
    }

    .box {
      stroke: #fff;

      &.front {
        stroke-width: 2;
        stroke-opacity: 0.3;
      }

      &.mid {
        stroke-width: 2;
        stroke-opacity: 0.2;
      }

      &.back {
        stroke-width: 1;
        stroke-opacity: 0;
      }
    }
  }
</style>
