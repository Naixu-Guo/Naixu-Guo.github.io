---
layout: default
title: "CV"
permalink: /cv/
description: "CV of Naixu Guo — education, research experience, awards, and professional service."
---

<section class="page-intro">
    <div class="container">
        <div class="page-intro__grid">
            <div class="page-intro__meta">
                <p class="page-kicker">CV</p>
            </div>
            <div class="page-intro__content">
                <h1 class="page-title">CV</h1>
                <p class="page-lead">{{ site.data.cv.intro }}</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section">
    <div class="container">
        <div class="cv-summary">
            <div class="cv-summary__main">
                <p class="cv-summary__lead">{{ site.data.cv.profile.summary }}</p>
                <div class="cv-summary__grid">
                    <div class="cv-summary__item">
                        <span>Role</span>
                        <p>{{ site.data.cv.personal_info.title }}</p>
                    </div>
                    <div class="cv-summary__item">
                        <span>Institution</span>
                        <p>{{ site.data.cv.personal_info.institution }}</p>
                    </div>
                    <div class="cv-summary__item">
                        <span>Location</span>
                        <p>{{ site.data.cv.personal_info.location }}</p>
                    </div>
                    <div class="cv-summary__item">
                        <span>Research</span>
                        <p>{{ site.data.cv.profile.research_keywords }}</p>
                    </div>
                </div>
            </div>
            <div class="cv-summary__actions">
                <a href="#" class="cv-action" onclick="window.print(); return false;">Print / Save as PDF</a>
                <a href="mailto:{{ site.email }}" class="cv-action">Email</a>
                {% for link in site.data.cv.profile.links %}
                <a href="{% if link.url contains 'mailto:' or link.url contains 'http' %}{{ link.url }}{% else %}{{ link.url | relative_url }}{% endif %}" class="cv-action"{% if link.url contains 'http' %} target="_blank" rel="noopener noreferrer"{% endif %}>{{ link.label }}</a>
                {% endfor %}
                <p class="cv-summary__note">{{ site.data.cv.profile.pdf_note }}</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--last">
    <div class="container">
        {% for section in site.data.cv.sections %}
        <section class="cv-section-block">
            <h2 class="cv-section-block__title">{{ section.title }}</h2>
            <div class="cv-section-block__items">
                {% for item in section.items %}
                <article class="cv-item">
                    <div>
                        <h3 class="cv-item__title">{{ item.title }}</h3>
                        {% if item.institution %}
                        <p class="cv-item__institution">{{ item.institution }}</p>
                        {% endif %}
                        {% if item.details and item.details != "" %}
                        <p class="cv-item__details">{{ item.details }}</p>
                        {% endif %}
                    </div>
                    {% if item.duration and item.duration != "" %}
                    <p class="cv-item__date">{{ item.duration }}</p>
                    {% endif %}
                </article>
                {% endfor %}
            </div>
        </section>
        {% endfor %}
    </div>
</section>
