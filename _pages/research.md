---
layout: default
title: "Research"
permalink: /research/
---

<!-- Header -->
<section class="py-12 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <a href="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
        </a>
        
        <h1 class="text-4xl font-serif font-bold text-gray-900 mb-4">
            {{ site.data.research.title }}
        </h1>
        <p class="text-xl text-gray-700 max-w-3xl">
            {{ site.data.research.subtitle }}
        </p>
    </div>
</section>

<!-- Research Areas -->
<section class="py-12 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Research Areas</h2>
        
        <div class="space-y-12">
            {% for area in site.data.research.research_areas %}
            <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div class="p-8">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                            {% if area.icon == "dna" %}
                                <i class="fas fa-dna text-2xl text-pink-600"></i>
                            {% elsif area.icon == "brain" %}
                                <i class="fas fa-brain text-2xl text-orange-600"></i>
                            {% elsif area.icon == "cogs" %}
                                <i class="fas fa-cogs text-2xl text-purple-600"></i>
                            {% else %}
                                <i class="fas fa-flask text-2xl text-blue-600"></i>
                            {% endif %}
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">{{ area.title }}</h3>
                    </div>
                    
                    <div class="prose prose-lg text-gray-700 leading-relaxed">
                        {{ area.description | markdownify }}
                    </div>

                    {% if area.image %}
                    {% assign figure_width_class = area.image_width | default: "max-w-3xl" %}
                    {% assign figure_aspect_class = area.image_aspect | default: "aspect-[3/2]" %}
                    <figure class="mt-8 {{ figure_width_class }} w-full mx-auto">
                        <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm {{ figure_aspect_class }}">
                            <img src="{{ area.image | relative_url }}"
                                 alt="{{ area.image_alt | default: area.title }}"
                                 class="w-full h-full object-cover"
                                 loading="lazy" />
                        </div>
                        {% if area.image_caption %}
                        <figcaption class="text-sm text-gray-600 text-center mt-3">
                            {{ area.image_caption }}
                        </figcaption>
                        {% endif %}
                    </figure>
                    {% endif %}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Include Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
