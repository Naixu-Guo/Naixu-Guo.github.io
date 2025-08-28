---
layout: default
title: Home
description: {{ site.data.about.hero.tagline }}
---

<!-- Hero Section -->
<section class="py-20 px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Left: Text -->
            <div>
                <h1 class="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-4">
                    {{ site.data.about.hero.name_en }}
                </h1>
                {% if site.data.about.hero.name_zh %}
                <h2 class="text-2xl md:text-3xl text-gray-700 mb-4">{{ site.data.about.hero.name_zh }}</h2>
                {% endif %}
                <p class="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl">
                    {{ site.data.about.hero.tagline }}
                </p>
                <p class="text-lg text-gray-600 mb-8 max-w-3xl">
                    {{ site.data.about.hero.summary }}
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    {% if site.data.about.hero.cta_primary %}
                    <a href="{{ site.data.about.hero.cta_primary.url | relative_url }}" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        {{ site.data.about.hero.cta_primary.label }}
                    </a>
                    {% endif %}
                    {% if site.data.about.hero.cta_secondary %}
                    <a href="{{ site.data.about.hero.cta_secondary.url | relative_url }}" class="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold">
                        {{ site.data.about.hero.cta_secondary.label }}
                    </a>
                    {% endif %}
                </div>
            </div>
            <!-- Right: Photo -->
            <div class="flex justify-center md:justify-end">
                <img src="{{ site.data.about.hero.avatar | relative_url }}" alt="{{ site.data.about.hero.name_en }}" class="w-56 h-56 rounded-full object-cover shadow-2xl border-4 border-white" />
            </div>
        </div>
    </div>
</section>

<!-- Research Focus Section -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">{{ site.data.about.research_focus.title }}</h2>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto">
                {{ site.data.about.research_focus.intro }}
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            {% for area in site.data.about.research_focus.areas %}
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    {% if area.icon == 'book-open' %}
                        <i class="fas fa-book-open text-2xl text-blue-600 mr-3"></i>
                    {% elsif area.icon == 'brain' %}
                        <i class="fas fa-brain text-2xl text-purple-600 mr-3"></i>
                    {% else %}
                        <i class="fas fa-flask text-2xl text-blue-600 mr-3"></i>
                    {% endif %}
                    <h3 class="text-xl font-semibold text-gray-900">{{ area.title }}</h3>
                </div>
                <p class="text-gray-700 mb-4">{{ area.description }}</p>
                {% if area.selected_works %}
                <div class="text-sm text-gray-600">
                    <strong>Selected works:</strong><br>
                    {% for work in area.selected_works %}
                        • {{ work }}<br>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Recent News Section -->
<section class="py-16 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">Recent News</h2>
        </div>
        <div class="space-y-6">
            {% assign limit = site.data.about.news.limit | default: 5 %}
            {% assign items = site.data.news | slice: 0, limit %}
            {% for news in items %}
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="text-gray-700">
                    {{ news.content | markdownify }}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

{% if site.data.about.contact.enabled %}
<!-- Contact Section -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-serif font-bold text-gray-900 mb-8">{{ site.data.about.contact.title }}</h2>
        <p class="text-lg text-gray-700 mb-8">
            {{ site.data.about.contact.message }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            {% if site.data.about.contact.email %}
            <a href="mailto:{{ site.data.about.contact.email }}" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <i class="fas fa-envelope mr-2"></i>Email Me
            </a>
            {% endif %}
            {% if site.data.about.contact.cv_url %}
            <a href="{{ site.data.about.contact.cv_url | relative_url }}" class="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold">
                <i class="fas fa-file-alt mr-2"></i>Download CV
            </a>
            {% endif %}
        </div>
    </div>
</section>
{% endif %}
