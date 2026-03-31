---
layout: default
title: Publications
permalink: /publications/
description: "Publications by Naixu Guo — featured work and a full publication record."
---

<section class="page-intro">
    <div class="container">
        <div class="page-intro__grid">
            <div class="page-intro__meta">
                <p class="page-kicker">Publications</p>
            </div>
            <div class="page-intro__content">
                <h1 class="page-title">Publications</h1>
                <p class="page-lead">A curated set of representative papers, followed by a compact archival list across quantum algorithms, AI for science, and quantum machine learning.</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Featured Publications</p>
            </div>
            <div class="section-content">
                {% assign featured = site.data.publications | where: "featured", true %}
                {% for pub in featured %}
                <article class="featured-publication">
                    <div class="featured-publication__rail">
                        <span>{{ pub.category | capitalize }}</span>
                        <span>{{ pub.year }}</span>
                    </div>
                    <div class="featured-publication__content">
                        <h2 class="featured-publication__title">{{ pub.title }}</h2>
                        {% capture journal_markup %}{{ pub.journal | markdownify }}{% endcapture %}
                        <p class="featured-publication__venue">{{ journal_markup | remove: '<p>' | remove: '</p>' | strip }}</p>
                        {% capture authors_markup %}{{ pub.authors | markdownify }}{% endcapture %}
                        <p class="featured-publication__authors">{{ authors_markup | remove: '<p>' | remove: '</p>' | strip }}</p>
                        <p class="featured-publication__summary">{{ pub.summary }}</p>
                        <div class="publication-links">
                            {% if pub.link %}
                            <a href="{{ pub.link }}" class="text-link" target="_blank" rel="noopener noreferrer">Paper</a>
                            {% endif %}
                            {% if pub.media_link %}
                            <a href="{{ pub.media_link }}" class="text-link" target="_blank" rel="noopener noreferrer">{{ pub.media_label | default: "Media" }}</a>
                            {% endif %}
                        </div>
                    </div>
                </article>
                {% endfor %}
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--last">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Full List</p>
            </div>
            <div class="section-content">
                {% assign grouped_publications = site.data.publications | group_by: "year" | sort: "name" | reverse %}
                {% for year in grouped_publications %}
                <div class="pub-year-group">
                    <h2 class="pub-year-group__title">{{ year.name }}</h2>
                    <div class="pub-archive">
                        {% for pub in year.items %}
                        <article class="pub-archive-item">
                            <div class="pub-archive-item__main">
                                <h3 class="pub-archive-item__title">{{ pub.title }}</h3>
                                {% capture authors_markup %}{{ pub.authors | markdownify }}{% endcapture %}
                                <p class="pub-archive-item__authors">{{ authors_markup | remove: '<p>' | remove: '</p>' | strip }}</p>
                                {% capture journal_markup %}{{ pub.journal | markdownify }}{% endcapture %}
                                <p class="pub-archive-item__venue">{{ journal_markup | remove: '<p>' | remove: '</p>' | strip }}</p>
                            </div>
                            <div class="pub-archive-item__links">
                                {% if pub.link %}
                                <a href="{{ pub.link }}" class="text-link" target="_blank" rel="noopener noreferrer">Paper</a>
                                {% endif %}
                                {% if pub.media_link %}
                                <a href="{{ pub.media_link }}" class="text-link" target="_blank" rel="noopener noreferrer">{{ pub.media_label | default: "Media" }}</a>
                                {% endif %}
                            </div>
                        </article>
                        {% endfor %}
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>
