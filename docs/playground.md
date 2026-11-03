---
layout: page
title: Playground
description: Try every v3-jsoneditor option live and copy the generated Vue SFC.
---

<div class="playground-page">

<header class="playground-intro">
  <h1><span class="i-solar-programming-bold-duotone" aria-hidden="true"></span> Playground</h1>
  <p>Tweak props on the left, edit JSON on the right, then copy the generated component code. Events are logged below.</p>
</header>

<Playground />

<p class="playground-ref">Looking for the full reference? See <a href="/api/props">Props</a>, <a href="/api/events">Events</a> and <a href="/api/methods">Methods</a>.</p>

</div>

<style>
.playground-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}
@media (min-width: 768px) {
  .playground-page { padding: 48px 32px 64px; }
}
.playground-intro h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.playground-intro h1 span {
  color: var(--vp-c-brand-1);
}
.playground-ref {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.playground-ref a {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.playground-intro p {
  margin: 8px 0 24px;
  max-width: 640px;
  color: var(--vp-c-text-2);
}
</style>
