---
layout: default
title: Publications
description: Peer-reviewed articles, conference proceedings, and academic contributions
---

<!-- Header -->
<section class="py-12 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <a href="{{ '/' | relative_url }}" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
        </a>
        
        <h1 class="text-4xl font-serif font-bold text-gray-900 mb-4">
            Publications & Research Output
        </h1>
        <p class="text-xl text-gray-700 max-w-3xl">
            Peer-reviewed articles, conference proceedings, and academic contributions
        </p>
    </div>
</section>

<!-- Publications List -->
<section class="py-12 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="space-y-8">
            {% assign publications = site.data.publications %}
            {% for pub in publications %}
            <div class="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
                <div class="p-6">
                    <div class="flex flex-col md:flex-row md:items-start gap-6">
                        <div class="flex-1">
                            <div class="flex items-start">
                                <span class="text-blue-600 font-bold mr-4 text-lg bg-blue-50 px-3 py-1 rounded-full">{{ forloop.index }}</span>
                                <div class="flex-1 space-y-4">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-900 mb-3">{{ pub.title }}</h3>
                                        <div class="space-y-3">
                                            {% capture authors_markup_raw %}{{ pub.authors | markdownify }}{% endcapture %}
                                            {% assign authors_markup = authors_markup_raw | replace: '<p>', '' | replace: '</p>', '' | strip %}
                                            {% capture journal_markup_raw %}{{ pub.journal | markdownify }}{% endcapture %}
                                            {% assign journal_markup = journal_markup_raw | replace: '<p>', '' | replace: '</p>', '' | strip %}
                                            <div class="text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 space-y-1">
                                                <div class="text-gray-700"><span class="font-semibold text-blue-700">Authors:</span> {{ authors_markup }}</div>
                                                {% if journal_markup %}
                                                <div class="text-gray-700">Venue: {{ journal_markup }}</div>
                                                {% endif %}
                                            </div>
                                            {% if pub.talks %}
                                            {% capture talks_markup_raw %}{{ pub.talks | markdownify }}{% endcapture %}
                                            {% assign talks_markup = talks_markup_raw | replace: '<p>', '' | replace: '</p>', '' | strip %}
                                            <div class="text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                                <span class="font-semibold text-blue-700">Presentations:</span> {{ talks_markup }}
                                            </div>
                                            {% endif %}
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-3">
                                        {% if pub.link %}
                                        <a href="{{ pub.link }}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                            <i class="fas fa-external-link-alt mr-2"></i>{{ pub.link_label | default: "View Paper" }}
                                        </a>
                                        {% endif %}
                                        {% if pub.pdf_link and pub.pdf_link != "#" %}
                                        <a href="{{ pub.pdf_link }}" target="_blank" rel="noopener noreferrer" class="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold">
                                            <i class="fas fa-file-pdf mr-2"></i>{{ pub.pdf_label | default: "PDF" }}
                                        </a>
                                        {% endif %}
                                        {% if pub.code_link and pub.code_link != "#" %}
                                        <a href="{{ pub.code_link }}" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                                            <i class="fas fa-code mr-2"></i>{{ pub.code_label | default: "Code" }}
                                        </a>
                                        {% endif %}
                                        {% if pub.media_link and pub.media_link != "#" %}
                                        <a href="{{ pub.media_link }}" target="_blank" rel="noopener noreferrer" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                                            <i class="{{ pub.media_icon | default: 'fas fa-video' }} mr-2"></i>{{ pub.media_label | default: "Media" }}
                                        </a>
                                        {% endif %}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {% if pub.image %}
                        <figure class="flex-shrink-0 w-full max-w-xs md:max-w-[14rem] mx-auto md:mx-0">
                            <div class="w-full h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm aspect-[4/3]">
                                <img src="{{ pub.image | relative_url }}" alt="{{ pub.image_alt | default: pub.title }}" class="w-full h-full object-cover" loading="lazy" />
                            </div>
                        </figure>
                        {% endif %}
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>


