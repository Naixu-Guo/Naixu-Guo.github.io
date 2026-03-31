---
layout: default
title: "Research"
permalink: /research/
description: "Research directions — quantum algorithms, AI for science, and quantum machine learning."
---

<section class="page-intro">
    <div class="container">
        <div class="page-intro__grid">
            <div class="page-intro__meta">
                <p class="page-kicker">Research</p>
            </div>
            <div class="page-intro__content">
                <h1 class="page-title">{{ site.data.research.title }}</h1>
                <p class="page-lead">{{ site.data.research.subtitle }}</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section">
    <div class="container">
        <div class="section-shell section-shell--vision">
            <div class="section-heading">
                <p class="section-kicker">{{ site.data.research.vision_title }}</p>
            </div>
            <div class="section-content">
                {% include vision-system.html page=true %}
                <p class="research-intro">{{ site.data.research.intro }}</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--last">
    <div class="container">
        <div class="research-map">
            {% for area in site.data.research.research_areas %}
            <article class="agenda-cluster agenda-cluster--{{ forloop.index }}">
                <div class="agenda-cluster__rail">
                    <div class="agenda-cluster__number">{{ area.number }}</div>
                    <h2 class="agenda-cluster__title">{{ area.title }}</h2>
                    <p class="agenda-cluster__summary">{{ area.summary }}</p>
                </div>
                <div class="agenda-cluster__content">
                    <div class="agenda-field">
                        <span>Conceptual Summary</span>
                        <p>{{ area.page_summary }}</p>
                    </div>
                    <div class="agenda-field">
                        <span>Keywords</span>
                        <p>{{ area.keywords }}</p>
                    </div>
                    <div class="agenda-field">
                        <span>Current Structure</span>
                        <ul class="agenda-list">
                            {% for thread in area.threads %}
                            <li>{{ thread }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                    {% if area.representative or area.representative2 %}
                    <div class="agenda-field">
                        <span>Representative Work</span>
                        <div class="agenda-links">
                            {% if area.representative %}
                            <a href="{{ area.representative.link }}" class="agenda-link" target="_blank" rel="noopener noreferrer">{{ area.representative.title }}</a>
                            <p class="agenda-link__venue">{{ area.representative.venue }}</p>
                            {% endif %}
                            {% if area.representative2 %}
                            <a href="{{ area.representative2.link }}" class="agenda-link" target="_blank" rel="noopener noreferrer">{{ area.representative2.title }}</a>
                            <p class="agenda-link__venue">{{ area.representative2.venue }}</p>
                            {% endif %}
                        </div>
                    </div>
                    {% endif %}
                </div>
            </article>
            {% endfor %}
        </div>
    </div>
</section>
