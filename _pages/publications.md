---
layout: default
title: "Publications"
permalink: /publications/
---

<!-- Publications Header -->
<section class="hero-section-small py-4" style="margin-top: 90px;">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto text-center">
                <h1 id="publications" class="display-5 fw-bold mb-2">Publications</h1>
            </div>
        </div>
    </div>
</section>

<!-- Publications List -->
<section class="publications-section py-4">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 mx-auto">
                {% assign publications = site.publications | sort: 'date' | reverse %}
                {% for pub in publications %}
                <div class="publication-item mb-3 p-3 bg-white rounded shadow-sm">
                    <div class="publication-header d-flex align-items-baseline mb-2">
                        <span class="publication-index me-2" style="color: #667eea; font-weight: 600; font-size: 0.9rem;">[{{ forloop.index }}]</span>
                        <h4 class="h6 mb-0 fw-bold">{{ pub.title }}</h4>
                    </div>
                    <p class="text-muted small mb-2"><strong>Authors:</strong> {{ pub.authors }}</p>
                    <p class="small mb-2">{{ pub.venue }}</p>
                    {% if pub.excerpt %}
                        <p class="small text-muted mb-2">{{ pub.excerpt }}</p>
                    {% endif %}
                    <div class="d-flex gap-1">
                        {% if pub.link and pub.link != "" and pub.link != "#" %}
                            <a href="{{ pub.link }}" target="_blank" class="btn btn-sm btn-outline-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Link</a>
                        {% endif %}
                        {% if pub.pdf_link and pub.pdf_link != "" and pub.pdf_link != "#" %}
                            <a href="{{ pub.pdf_link | relative_url }}" target="_blank" class="btn btn-sm btn-outline-primary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">PDF</a>
                        {% endif %}
                        {% if pub.code_link and pub.code_link != "" and pub.code_link != "#" %}
                            <a href="{{ pub.code_link }}" target="_blank" class="btn btn-sm btn-outline-success" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Code</a>
                        {% endif %}
                        {% if pub.media_link and pub.media_link != "" and pub.media_link != "#" %}
                            <a href="{{ pub.media_link }}" target="_blank" class="btn btn-sm btn-outline-info" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Media</a>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>

<style>
.publication-item {
    border-left: 3px solid #667eea;
    transition: all 0.3s ease;
}

.publication-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15) !important;
}

.publication-index {
    flex-shrink: 0;
}

.hero-section-small {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.publications-section {
    background-color: #f8f9fa;
}
</style>
