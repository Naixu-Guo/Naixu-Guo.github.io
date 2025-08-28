---
layout: default
title: "Publications"
permalink: /publications/
---

<!-- Header -->
<section class="py-12 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <a href="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
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
                    <div class="flex items-start mb-4">
                        <span class="text-blue-600 font-bold mr-4 text-lg bg-blue-50 px-3 py-1 rounded-full">{{ forloop.index }}</span>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ pub.title }}</h3>
                            <div class="text-gray-700 space-y-2">
                                <div class="text-sm font-medium text-gray-600">
                                    <span class="font-semibold">Authors:</span> {{ pub.authors | markdownify | replace: '<p>', '' | replace: '</p>', '' }}
                                </div>
                                <div class="text-sm">
                                    <span class="font-semibold text-gray-600">Journal:</span> {{ pub.journal }}
                                </div>
                                {% if pub.talks %}
                                <div class="text-sm">
                                    <span class="font-semibold text-gray-600">Talks:</span>
                                    {% assign talks_json = pub.talks | jsonify %}
                                    {% if talks_json contains '[' %}
                                        <ul class="list-disc list-inside text-gray-700 mt-1 space-y-1">
                                            {% for talk in pub.talks %}
                                            <li>
                                                {% if talk.title or talk.venue or talk.location or talk.date or talk.link %}
                                                    {% if talk.title %}<span class="font-medium">{{ talk.title }}</span>{% endif %}
                                                    {% if talk.venue %}{% if talk.title %} · {% endif %}{{ talk.venue }}{% endif %}
                                                    {% if talk.location %}{% if talk.title or talk.venue %} · {% endif %}{{ talk.location }}{% endif %}
                                                    {% if talk.date %}{% if talk.title or talk.venue or talk.location %} · {% endif %}{{ talk.date }}{% endif %}
                                                    {% if talk.link %} — <a href="{{ talk.link }}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Details</a>{% endif %}
                                                {% else %}
                                                    {{ talk }}
                                                {% endif %}
                                            </li>
                                            {% endfor %}
                                        </ul>
                                    {% else %}
                                        <span class="text-gray-700">{{ pub.talks }}</span>
                                    {% endif %}
                                </div>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 ml-16">
                        {% if pub.link and pub.link != "" and pub.link != "#" %}
                            <a href="{{ pub.link }}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                <i class="fas fa-external-link-alt mr-2"></i>View Paper
                            </a>
                        {% endif %}
                        {% if pub.pdf_link and pub.pdf_link != "" and pub.pdf_link != "#" %}
                            <a href="{{ pub.pdf_link | relative_url }}" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </a>
                        {% endif %}
                        {% if pub.code_link and pub.code_link != "" and pub.code_link != "#" %}
                            <a href="{{ pub.code_link }}" target="_blank" rel="noopener noreferrer" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                                <i class="fas fa-code mr-2"></i>Code
                            </a>
                        {% endif %}
                        {% if pub.media_link and pub.media_link != "" and pub.media_link != "#" %}
                            <div class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                {{ pub.media_link | markdownify | replace: '<p>', '' | replace: '</p>', '' }}
                            </div>
                        {% endif %}
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Talks Section -->
{% if site.talks and site.talks.size > 0 %}
<section class="py-12 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Talks</h2>
        {% assign talks = site.talks | sort: 'date' | reverse %}
        <div class="space-y-4">
            {% for talk in talks %}
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex flex-wrap justify-between gap-2">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ talk.title }}</h3>
                        <div class="text-sm text-gray-600">
                            {% if talk.venue %}<span class="font-medium">{{ talk.venue }}</span>{% endif %}
                            {% if talk.location %}{% if talk.venue %} · {% endif %}Talks: {{ talk.location }}{% endif %}
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">{{ talk.date | date: '%Y-%m-%d' }}</div>
                </div>
                {% if talk.link %}
                <div class="mt-2">
                    <a href="{{ talk.link }}" target="_blank" rel="noopener" class="text-blue-600 hover:underline text-sm">Details</a>
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
    </div>
</section>
{% endif %}

<!-- Include Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
