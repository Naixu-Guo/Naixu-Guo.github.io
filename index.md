---
layout: default
title: Home
description: PhD Student and Rising Star Researcher - Academic Homepage showcasing cutting-edge research and publications
---

<!-- Hero Section -->
<section class="py-20 px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-6xl mx-auto text-center">
        <div class="mb-8">
            <img src="{{ '/photo.jpg' | relative_url }}" alt="Dr. Naixu Guo" class="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg">
        </div>
        <h1 class="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
            Naixu Guo
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            PhD Student and Rising Star Researcher - Academic Homepage showcasing cutting-edge research and publications
        </p>
        <p class="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            My research aims to uncover and harness the fundamental computational principles of nature, especially quantum, to pioneer transformative algorithms and new paradigms of intelligence.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="{{ '/research' | relative_url }}" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                View Research
            </a>
            <a href="{{ '/publications' | relative_url }}" class="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold">
                Publications
            </a>
        </div>
    </div>
</section>

<!-- Research Focus Section -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">Research Focus</h2>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto">
                My research aims to uncover and harness the fundamental computational principles of nature, especially quantum, to pioneer transformative algorithms and new paradigms of intelligence.
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <!-- Quantum Linear Algebra Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    <i class="fas fa-book-open text-2xl text-blue-600 mr-3"></i>
                    <h3 class="text-xl font-semibold text-gray-900">Quantum linear algebra and its applications</h3>
                </div>
                <p class="text-gray-700 mb-4">
                    As we approach the limitations of classical hardware scaling, the development of quantum computing provides the next leap in computational capability. Quantum linear algebra explores efficient methods based on the principles of quantum mechanics, which is intrinsically linear, and applies them to real-world applications, like machine learning, optimization, and chemistry.
                </p>
                <div class="text-sm text-gray-600">
                    <strong>Selected works:</strong><br>
                    • N. Guo, etc., Quantum linear algebra is all you need for Transformer architectures, arXiv:2402.16714<br>
                    • N. Guo, K. Mitarai, K. Fujii, Nonlinear transformation of complex amplitudes via quantum singular value transformation, Phys. Rev. Research 6, 043227<br>
                    • S. Yang, N. Guo, M. Santha, P. Rebentrost, Quantum Alphatron: quantum advantage for learning with kernels and noise, Quantum 7, 1174
                </div>
            </div>

            <!-- AI for Quantum Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-center mb-4">
                    <i class="fas fa-brain text-2xl text-purple-600 mr-3"></i>
                    <h3 class="text-xl font-semibold text-gray-900">Artificial intelligence for quantum</h3>
                </div>
                <p class="text-gray-700 mb-4">
                    As we confront the immense complexity and environmental sensitivity of near-term quantum processors, the field of AI for Quantum provides a critical pathway toward practical quantum advantage. This discipline leverages powerful classical machine learning methods to address fundamental challenges in building and operating quantum computers.
                </p>
                <div class="text-sm text-gray-600">
                    <strong>Selected works:</strong><br>
                    • L. Ming, N. Guo, M. Luo, P. Rebentrost, Provable learning of quantum states with graphical models, arXiv:2309.09235
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Recent News Section -->
<section class="py-16 px-8 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">Recent News</h2>
        </div>
        
        <div class="space-y-6">
            {% for news in site.data.news %}
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="text-gray-700">
                    {{ news.content | markdownify }}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Contact Section -->
<section class="py-16 px-8 bg-white">
    <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-serif font-bold text-gray-900 mb-8">Get in Touch</h2>
        <p class="text-lg text-gray-700 mb-8">
            I'm always interested in discussing research collaborations, opportunities, or just having a chat about quantum computing and AI.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:your.email@example.com" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <i class="fas fa-envelope mr-2"></i>Email Me
            </a>
            <a href="{{ '/cv' | relative_url }}" class="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold">
                <i class="fas fa-file-alt mr-2"></i>Download CV
            </a>
        </div>
    </div>
</section>
