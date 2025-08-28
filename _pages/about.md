---
layout: default
title: "About"
permalink: /about/
description: {{ site.data.about.hero.tagline }}
---

<!-- Hero Section -->
<section class="py-16 px-8 bg-gray-50">
  <div class="max-w-5xl mx-auto">
    <div class="grid lg:grid-cols-3 gap-12 items-start">
      <!-- Left: Text spans 2 columns -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center space-x-3 mb-2">
          <i class="fas fa-user text-gray-600"></i>
          <span class="text-gray-600 font-medium">{{ site.data.about.hero.role }}</span>
        </div>
        
        <h1 class="text-4xl font-serif font-bold text-gray-900 leading-tight">
          {{ site.data.about.hero.name_en }}{% if site.data.about.hero.name_zh %} ({{ site.data.about.hero.name_zh }}){% endif %}
        </h1>
        
        <div class="flex items-center space-x-3 text-gray-700">
          <i class="fas fa-building text-gray-600"></i>
          <span class="font-medium">{{ site.data.about.hero.affiliation }}</span>
        </div>
        
        <div class="hero-summary text-lg text-gray-700 leading-relaxed">
          {{ site.data.about.hero.summary | markdownify }}
        </div>
        
        <div class="flex flex-wrap gap-4">
          {% if site.data.about.hero.cta_primary %}
          <a href="{{ site.data.about.hero.cta_primary.url | relative_url }}" class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold">
            <i class="fas fa-book-open mr-2"></i>{{ site.data.about.hero.cta_primary.label }}
          </a>
          {% endif %}
          {% if site.data.about.hero.cta_secondary %}
          <a href="{{ site.data.about.hero.cta_secondary.url | relative_url }}" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-semibold">
            <i class="fas fa-external-link-alt mr-2"></i>{{ site.data.about.hero.cta_secondary.label }}
          </a>
          {% endif %}
          {% if site.data.about.hero.contact_email %}
          <a href="mailto:{{ site.data.about.hero.contact_email }}" class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-semibold">
            <i class="fas fa-envelope mr-2"></i>Contact
          </a>
          {% endif %}
        </div>

        <div class="flex space-x-4 pt-2">
          {% if site.data.about.hero.socials.scholar %}
          <a href="{{ site.data.about.hero.socials.scholar }}" class="text-gray-500 hover:text-gray-700" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-graduation-cap"></i>
          </a>
          {% endif %}
          {% if site.data.about.hero.socials.x %}
          <a href="{{ site.data.about.hero.socials.x }}" class="text-gray-500 hover:text-gray-700" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-x-twitter"></i>
          </a>
          {% endif %}
          {% if site.data.about.hero.socials.linkedin %}
          <a href="{{ site.data.about.hero.socials.linkedin }}" class="text-gray-500 hover:text-gray-700" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin"></i>
          </a>
          {% endif %}
        </div>
      </div>

      <!-- Right: Avatar -->
      <div class="flex justify-center lg:justify-end">
        <img src="{{ site.data.about.hero.avatar | relative_url }}" alt="{{ site.data.about.hero.name_en }}" class="w-64 h-64 rounded-full object-cover border-4 border-white shadow-lg" />
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
    {% assign limit = site.data.about.news.limit | default: 5 %}
    {% assign items = site.data.news | slice: 0, limit %}
    <ul class="space-y-3">
      {% for news in items %}
      <li class="flex items-start">
        <i class="fas fa-circle-check text-blue-600 mr-3 mt-1"></i>
        <div class="news-content text-gray-700">{{ news.content | markdownify }}</div>
      </li>
      {% endfor %}
    </ul>
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

