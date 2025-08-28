---
title: "{{ site.data.cv.title }}"
permalink: /cv/
---

<!-- Header -->
<section class="py-12 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <a href="/" class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
        </a>
        
        <h1 class="text-4xl font-serif font-bold text-gray-900 mb-4">
            {{ site.data.cv.title }}
        </h1>
        <p class="text-xl text-gray-700 max-w-3xl">
            {{ site.data.cv.subtitle }}
        </p>
    </div>
</section>

<!-- Personal Information -->
<section class="py-8 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center shadow-lg">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                {{ site.data.cv.personal_info.name }}
            </h2>
            <p class="text-xl text-gray-700 mb-4">
                {{ site.data.cv.personal_info.title }}
            </p>
            <p class="text-lg text-gray-600 mb-6">
                {{ site.data.cv.personal_info.institution }}
            </p>
            
            <div class="flex justify-center items-center space-x-8 text-gray-600">
                {% if site.data.cv.personal_info.email %}
                <div class="flex items-center space-x-2">
                    <i class="fas fa-envelope text-blue-600"></i>
                    <span>{{ site.data.cv.personal_info.email }}</span>
                </div>
                {% endif %}
                {% if site.data.cv.personal_info.phone %}
                <div class="flex items-center space-x-2">
                    <i class="fas fa-phone text-blue-600"></i>
                    <span>{{ site.data.cv.personal_info.phone }}</span>
                </div>
                {% endif %}
                {% if site.data.cv.personal_info.location %}
                <div class="flex items-center space-x-2">
                    <i class="fas fa-map-marker-alt text-blue-600"></i>
                    <span>{{ site.data.cv.personal_info.location }}</span>
                </div>
                {% endif %}
            </div>
        </div>
    </div>
</section>

<!-- CV Sections -->
<section class="py-8 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        {% for section in site.data.cv.sections %}
        <div class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">{{ section.title }}</h2>
            
            <div class="space-y-6">
                {% for item in section.items %}
                <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-gray-900">
                            {{ item.title }}
                        </h3>
                        {% if item.duration %}
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {{ item.duration }}
                        </span>
                        {% endif %}
                    </div>
                    
                    {% if item.institution %}
                    <p class="text-lg text-gray-700 font-medium mb-3">
                        {{ item.institution }}
                    </p>
                    {% endif %}
                    
                    {% if item.details %}
                    <p class="text-gray-600 leading-relaxed">
                        {{ item.details }}
                    </p>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
        </div>
        {% endfor %}
    </div>
</section>

<!-- Include Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

