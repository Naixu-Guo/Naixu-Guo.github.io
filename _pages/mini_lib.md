---
layout: default
title: "Mini Library"
permalink: /mini_lib/
---

<!-- Header -->
<section class="py-12 px-8 bg-gray-50">
  <div class="max-w-6xl mx-auto text-center">
    <h1 class="text-4xl font-serif font-bold text-gray-900 mb-3">{{ site.data.mini_lib.title }}</h1>
    <p class="text-lg text-gray-700 max-w-3xl mx-auto">{{ site.data.mini_lib.subtitle }}</p>
  </div>
  </section>

<!-- Categories -->
<section class="py-12 px-8 bg-white">
  <div class="max-w-6xl mx-auto space-y-12">
    {% for category in site.data.mini_lib.categories %}
    <div class="bg-white">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ category.title }}</h2>
      {% if category.description %}
        <p class="text-gray-600 mb-6">{{ category.description }}</p>
      {% endif %}

      {% for subcategory in category.subcategories %}
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ subcategory.title }}</h3>
        <div class="grid md:grid-cols-2 gap-6">
          {% for item in subcategory.items %}
          <div class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div class="flex items-start">
              <div class="mr-3 mt-1 text-blue-600">
                {% case item.type %}
                  {% when 'book' %}
                    <i class="fas fa-book"></i>
                  {% when 'paper' %}
                    <i class="fas fa-file-alt"></i>
                  {% when 'lecture_notes' %}
                    <i class="fas fa-graduation-cap"></i>
                  {% when 'documentation' %}
                    <i class="fas fa-file-code"></i>
                  {% when 'tool' %}
                    <i class="fas fa-tools"></i>
                  {% when 'paper_collection' %}
                    <i class="fas fa-folder-open"></i>
                  {% else %}
                    <i class="fas fa-link"></i>
                {% endcase %}
              </div>
              <div class="flex-1">
                <h4 class="text-base font-semibold text-gray-900 mb-1">
                  <a href="{{ item.link }}" target="_blank" rel="noopener" class="text-blue-600 hover:underline">
                    {{ item.title }}
                    <i class="fas fa-external-link-alt text-gray-400 ml-1 text-xs"></i>
                  </a>
                </h4>
                <div class="text-xs uppercase tracking-wide text-gray-500">{{ item.type | replace: '_', ' ' }}</div>
              </div>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </div>
    {% endfor %}
  </div>
</section>
