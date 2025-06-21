---
layout: default
title: "Talks"
permalink: /talks/
---

<!-- Talks Header -->
<section class="hero-section-small py-4" style="margin-top: 90px;">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto text-center">
                <h1 id="talks" class="display-5 fw-bold mb-2">Talks & Presentations</h1>
            </div>
        </div>
    </div>
</section>

<!-- Talks List -->
<section class="talks-section py-4">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 mx-auto">
                <div class="talks-list">
                    {% assign sorted_talks = site.talks | sort: 'date' | reverse %}
                    {% for talk in sorted_talks %}
                    <div class="talk-item mb-4">
                        <div class="talk-date text-muted mb-2">{{ talk.date | date: "%Y/%m" }}</div>
                        <div class="talk-title">
                            <a href="{{ talk.url }}" class="talk-link">{{ talk.title }}</a>
                        </div>
                        <div class="talk-venue">{{ talk.venue }}</div>
                        <div class="talk-location">{{ talk.location }}</div>
                        {% if talk.content contains 'http' %}
                        <div class="talk-links mt-2">
                            <a href="#" class="btn btn-sm btn-outline-primary me-2">Slides</a>
                            <a href="#" class="btn btn-sm btn-outline-secondary me-2">Video</a>
                        </div>
                        {% endif %}
                    </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.hero-section-small {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.talks-section {
    background-color: #f8f9fa;
}
</style> 