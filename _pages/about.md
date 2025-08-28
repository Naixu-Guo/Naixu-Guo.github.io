---
title: "About"
permalink: /about/
---

<!-- Hero Section -->
<section class="py-20 px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-6xl mx-auto text-center">
        <div class="mb-12">
            <img src="{{ site.baseurl }}/photo.jpg" alt="Naixu Guo" class="w-48 h-48 rounded-full mx-auto mb-8 shadow-2xl border-4 border-white">
        </div>
        
        <h1 class="text-6xl font-bold text-gray-900 mb-6">
            Naixu Guo
        </h1>
        
        <div class="mb-8">
            <h2 class="text-3xl font-serif text-gray-700 mb-4">郭乃绪</h2>
        </div>
        
        <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            I am a researcher in quantum computing and machine learning, currently working on quantum algorithms for optimization and machine learning tasks.
        </p>
        
        <div class="flex justify-center space-x-6 text-gray-600 mb-12">
            <div class="flex items-center space-x-2">
                <i class="fas fa-envelope text-blue-600"></i>
                <span>naixu.guo@example.com</span>
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-map-marker-alt text-blue-600"></i>
                <span>University of Example</span>
            </div>
        </div>
    </div>
</section>

<!-- Research Overview -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Research Overview</h2>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-blue-50 p-6 rounded-xl">
                <h3 class="text-xl font-bold text-blue-900 mb-4">Quantum Computing</h3>
                <p class="text-gray-700">Developing quantum algorithms for optimization and machine learning tasks, exploring the potential of quantum systems for computational advantage.</p>
            </div>
            <div class="bg-indigo-50 p-6 rounded-xl">
                <h3 class="text-xl font-bold text-indigo-900 mb-4">Machine Learning</h3>
                <p class="text-gray-700">Researching novel machine learning approaches, particularly in the intersection of quantum computing and classical ML techniques.</p>
            </div>
        </div>
    </div>
</section>

<!-- Recent News -->
<section class="py-16 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Recent News</h2>
        <div class="space-y-6">
            {% assign news = site.data.news | slice: 0, 5 %}
            {% for item in news %}
            <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div class="flex items-start space-x-4">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="text-gray-700 leading-relaxed">
                            {{ item.content | markdownify }}
                        </div>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Quick Links -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Links</h2>
        <div class="grid md:grid-cols-3 gap-6">
            <a href="/research" class="group">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1">
                    <i class="fas fa-flask text-3xl mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Research</h3>
                    <p class="text-blue-100">Explore my research areas</p>
                </div>
            </a>
            <a href="/publications" class="group">
                <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white text-center hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1">
                    <i class="fas fa-book text-3xl mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Publications</h3>
                    <p class="text-green-100">View my academic work</p>
                </div>
            </a>
            <a href="/cv" class="group">
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1">
                    <i class="fas fa-user-graduate text-3xl mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">CV</h3>
                    <p class="text-purple-100">My academic background</p>
                </div>
            </a>
        </div>
    </div>
</section>

<!-- Include Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

