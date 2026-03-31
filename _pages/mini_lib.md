---
layout: default
title: "Library"
permalink: /library/
description: "A curated collection of references for quantum computing, machine learning, and related topics."
---

<section class="page-intro">
    <div class="container">
        <div class="page-intro__grid">
            <div class="page-intro__meta">
                <p class="page-kicker">Library</p>
            </div>
            <div class="page-intro__content">
                <h1 class="page-title">Library</h1>
                <p class="page-lead">{{ site.data.mini_lib.subtitle }}</p>
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--last">
    <div class="container">
        <div class="library-categories">
            {% for category in site.data.mini_lib.categories %}
            <section class="library-category">
                <div class="library-category__intro">
                    <h2 class="library-category__title">{{ category.title }}</h2>
                    {% if category.description %}
                    <p class="library-category__desc">{{ category.description }}</p>
                    {% endif %}
                </div>
                <div class="library-category__content">
                    {% for subcategory in category.subcategories %}
                    <div class="library-block">
                        <h3 class="library-block__title">{{ subcategory.title }}</h3>
                        <div class="library-items">
                            {% for item in subcategory.items %}
                            <article class="library-item">
                                <a href="{{ item.link }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                                <span>{{ item.type | replace: '_', ' ' }}</span>
                            </article>
                            {% endfor %}
                        </div>
                    </div>
                    {% endfor %}
                </div>
            </section>
            {% endfor %}
        </div>
    </div>
</section>
