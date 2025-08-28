---
title: "Publications"
permalink: /publications/
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Publications - Dr. Naixu Guo - Academic Homepage</title>
    <meta name="description" content="Peer-reviewed articles, conference proceedings, and academic contributions">
    <meta name="author" content="Dr. Naixu Guo">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Publications">
    <meta property="og:description" content="Peer-reviewed articles, conference proceedings, and academic contributions">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://naixu-guo.github.io/publications/">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Publications">
    <meta name="twitter:description" content="Peer-reviewed articles, conference proceedings, and academic contributions">
    
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
                    <a href="/contact" class="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
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
                                            <span class="font-semibold">Authors:</span> {{ pub.authors | markdownify | strip_html }}
                                        </div>
                                        <div class="text-sm">
                                            <span class="font-semibold text-gray-600">Venue:</span> {{ pub.journal }}
                                        </div>
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
                                        {{ pub.media_link | markdownify | strip_html }}
                                    </div>
                                {% endif %}
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
