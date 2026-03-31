---
layout: default
title: "Updates"
permalink: /updates/
description: "Research updates, talks, visits, and milestones from Naixu Guo."
---

<section class="page-intro">
    <div class="container">
        <div class="page-intro__grid">
            <div class="page-intro__meta">
                <p class="page-kicker">Updates</p>
            </div>
            <div class="page-intro__content">
                <h1 class="page-title">Updates</h1>
                <p class="page-lead">A quiet archive of recent papers, talks, research visits, and milestones.</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--last">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Archive</p>
            </div>
            <div class="section-content">
                <div class="updates-archive">
                    {% for item in site.data.news %}
                    <article class="update-archive-item">
                        <div class="update-archive-item__date">{{ item.date }}</div>
                        <div class="update-archive-item__content">
                            {{ item.content | markdownify }}
                        </div>
                    </article>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</section>
