---
title: "{{ site.data.research.title }}"
permalink: /research/
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Research - Dr. Naixu Guo - Academic Homepage</title>
    <meta name="description" content="Research areas and computational methodologies for scientific discovery">
    <meta name="author" content="Dr. Naixu Guo">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Research">
    <meta property="og:description" content="Research areas and computational methodologies for scientific discovery">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://naixu-guo.github.io/research/">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Research">
    <meta name="twitter:description" content="Research areas and computational methodologies for scientific discovery">
    
    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="bg-white text-gray-900">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        Dr. Naixu Guo
                    </a>
                </div>
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                    <a href="/research" class="text-gray-700 hover:text-blue-600 transition-colors">Research</a>
                    <a href="/publications" class="text-gray-700 hover:text-blue-600 transition-colors">Publications</a>
                    <a href="/cv" class="text-gray-700 hover:text-blue-600 transition-colors">CV</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main>
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
                        </div>
                    </div>
                    {% endfor %}
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-6xl mx-auto px-8 text-center">
            <p>&copy; 2025 Dr. Naixu Guo. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
