---
layout: default
title: "Curriculum Vitae"
permalink: /cv/
---

<!-- Header -->
<section class="py-8 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                    {{ site.data.cv.title }}
                </h1>
                <p class="text-base md:text-lg text-gray-700 max-w-3xl mt-2">
                    {{ site.data.cv.subtitle }}
                </p>
            </div>
            <div class="mt-1">
                <button onclick="window.print()" class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold">
                    <i class="fas fa-file-download mr-2"></i> Print / Save as PDF
                </button>
            </div>
        </div>
    </div>
    </section>

<!-- Personal Information (compact) -->
<section class="py-6 px-8 bg-white">
    <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
            {{ site.data.cv.personal_info.name }}
        </h2>
        <p class="text-base md:text-lg text-gray-700">
            {{ site.data.cv.personal_info.title }}
        </p>
        <p class="text-sm md:text-base text-gray-600">
            {{ site.data.cv.personal_info.institution }}
        </p>
        <div class="flex justify-center items-center gap-6 text-gray-600 mt-3 text-sm">
            {% if site.data.cv.personal_info.email %}
            <div class="flex items-center gap-2">
                <i class="fas fa-envelope text-blue-600"></i>
                <span>{{ site.data.cv.personal_info.email }}</span>
            </div>
            {% endif %}
            {% if site.data.cv.personal_info.location %}
            <div class="flex items-center gap-2">
                <i class="fas fa-map-marker-alt text-blue-600"></i>
                <span>{{ site.data.cv.personal_info.location }}</span>
            </div>
            {% endif %}
        </div>
    </div>
    </section>

<!-- CV Sections (compact cards) -->
<section class="py-4 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        {% for section in site.data.cv.sections %}
        <div class="mb-6">
            <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center">{{ section.title }}</h2>
            
            <div class="space-y-3">
                {% for item in section.items %}
                <div class="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow p-3">
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="text-base md:text-lg font-semibold text-gray-900">
                            {{ item.title }}
                        </h3>
                        {% if item.duration %}
                        <span class="bg-blue-100 text-blue-800 text-[11px] font-medium px-2 py-0.5 rounded-full">
                            {{ item.duration }}
                        </span>
                        {% endif %}
                    </div>
                    
                    {% if item.institution %}
                    <p class="text-sm md:text-base text-gray-700 font-medium mb-1.5">
                        {{ item.institution }}
                    </p>
                    {% endif %}
                    
                    {% if item.details %}
                    <p class="text-[13px] text-gray-600 leading-relaxed">
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

<!-- Print styles for PDF export -->
<style>
@media print {
  nav, footer { display: none !important; }
  body { color: #000; }
  a { color: #000; text-decoration: none; }
  section { padding: 0 !important; }
  .rounded-lg, .rounded-md { border-radius: 0 !important; }
  .border { border-color: #e5e7eb !important; }
  .max-w-6xl { max-width: 100% !important; }
  .bg-gray-50, .bg-white { background: #fff !important; }
  .hover\:shadow-sm, .hover\:shadow-md { box-shadow: none !important; }
  button { display: none !important; }
}
</style>

<!-- Include Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

