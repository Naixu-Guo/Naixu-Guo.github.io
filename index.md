---
layout: default
title: Home
permalink: /
description: "Naixu Guo — Quantum algorithms, structured learning, and scientific discovery."
---

<section class="hero home-hero">
    <div class="container">
        <div class="hero-stage relative overflow-hidden" id="hero-stage">
            <canvas id="hero-canvas" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>
            <div class="hero-stage__content">
                <div class="hero-grid">
                    <div class="hero-media">
                        <div class="hero-media__frame">
                            <img src="{{ site.data.about.hero.avatar | relative_url }}" alt="Naixu Guo" class="hero-portrait">
                        </div>
                    </div>
                    <div class="hero-content">
                        <p class="hero-kicker">{{ site.data.about.hero.kicker }}</p>
                        <h1 class="hero-name">{{ site.data.about.hero.name_en }}</h1>
                        <p class="hero-tagline">
                            <span>{{ site.data.about.hero.tagline }}</span>
                        </p>
                        <p class="hero-statement">
                            <span>{{ site.data.about.hero.statement }}</span>
                        </p>
                        <div class="hero-actions">
                            <a href="{{ '/research/' | relative_url }}" class="button-link">Research</a>
                            <a href="{{ '/publications/' | relative_url }}" class="button-link">Publications</a>
                            <a href="{{ '/cv/' | relative_url }}" class="button-link">CV</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="field-section field-section--vision home-section home-section--vision">
    <div class="container">
        <div class="section-shell section-shell--vision">
            <div class="section-heading">
                <p class="section-kicker">{{ site.data.research.vision_title }}</p>
            </div>
            <div class="section-content">
                {% include vision-system.html %}
            </div>
        </div>
    </div>
</section>

<section class="field-section home-section home-section--directions">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Research Directions</p>
            </div>
            <div class="section-content">
                <div class="directions-map">
                    {% for area in site.data.research.research_areas %}
                    <article class="direction-node direction-node--{{ forloop.index }}">
                        <div class="direction-node__number">{{ area.number }}</div>
                        <h3 class="direction-node__title">{{ area.title }}</h3>
                        <p class="direction-node__keywords">{{ area.keywords }}</p>
                        <div class="direction-node__detail">
                            <span>Focus</span>
                            <p>{{ area.focus }}</p>
                        </div>
                        {% if area.representative or area.representative2 %}
                        <div class="direction-node__detail">
                            <span>Representative</span>
                            <div class="direction-node__links">
                                {% if area.representative %}
                                <a href="{{ area.representative.link }}" class="direction-node__link" target="_blank" rel="noopener noreferrer">{{ area.representative.title }}</a>
                                <p class="direction-node__venue">{{ area.representative.venue }}</p>
                                {% endif %}
                                {% if area.representative2 %}
                                <a href="{{ area.representative2.link }}" class="direction-node__link direction-node__link--secondary" target="_blank" rel="noopener noreferrer">{{ area.representative2.title }}</a>
                                <p class="direction-node__venue">{{ area.representative2.venue }}</p>
                                {% endif %}
                            </div>
                        </div>
                        {% endif %}
                    </article>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</section>

<section class="field-section home-section home-section--selected">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Selected Work</p>
            </div>
            <div class="section-content">
                <div class="selected-map">
                    {% for work in site.data.about.selected_works %}
                    {% assign mapping_parts = work.mapping | split: ' × ' %}
                    <article class="selected-work selected-work--{{ forloop.index }}">
                        <h3 class="selected-work__title">
                            <a href="{{ work.link }}" target="_blank" rel="noopener noreferrer">{{ work.title }}</a>
                        </h3>
                        <div class="selected-work__arrow">&rarr;</div>
                        <p class="selected-work__mapping">
                            {% if mapping_parts.size > 1 %}
                            <span class="selected-work__relation">
                                <span class="selected-work__term">{{ mapping_parts[0] }}</span>
                                <span class="selected-work__connector">&times;</span>
                                <span class="selected-work__term selected-work__term--strong">{{ mapping_parts[1] }}</span>
                            </span>
                            {% else %}
                            <span class="selected-work__relation">
                                <span class="selected-work__term selected-work__term--strong">{{ work.mapping }}</span>
                            </span>
                            {% endif %}
                        </p>
                    </article>
                    {% endfor %}
                </div>
                <div class="section-link">
                    <a href="{{ '/publications/' | relative_url }}" class="text-link">View all publications</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="field-section home-section home-section--updates">
    <div class="container">
        <div class="section-shell">
            <div class="section-heading">
                <p class="section-kicker">Recent Updates</p>
            </div>
            <div class="section-content">
                <div class="updates-list">
                    {% assign homepage_news = site.data.news | slice: 0, 3 %}
                    {% for item in homepage_news %}
                    <article class="update-item">
                        <div class="update-item__year">{{ item.date }}</div>
                        <div class="update-item__text">{{ item.content | markdownify | remove: '<p>' | remove: '</p>' }}</div>
                    </article>
                    {% endfor %}
                </div>
                <div class="section-link">
                    <a href="{{ '/updates/' | relative_url }}" class="text-link">View full update archive</a>
                </div>
            </div>
        </div>
    </div>
</section>

{% if site.data.about.contact.enabled %}
<section class="field-section field-section--contact home-section home-section--contact">
    <div class="container">
        <div class="contact-block">
            <div class="section-heading">
                <p class="section-kicker">Get in Touch</p>
            </div>
            <div class="contact-copy">
                <p>{{ site.data.about.contact.message }}</p>
                <div class="contact-links">
                    <a href="mailto:{{ site.email }}" class="contact-link">Email</a>
                    <a href="{{ site.data.about.hero.socials.scholar }}" class="contact-link" target="_blank" rel="noopener noreferrer">Scholar</a>
                    <a href="{{ '/cv/' | relative_url }}" class="contact-link">CV</a>
                </div>
            </div>
        </div>
    </div>
</section>
{% endif %}
