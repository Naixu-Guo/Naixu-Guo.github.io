---
title: "Publications"
permalink: /publications/
---

# Publications

{% assign publications = site.data.publications | sort: 'date' | reverse %}
{% for pub in publications %}
<div class="publication-item mb-3 p-3 bg-white rounded shadow-sm">
    <div class="publication-header d-flex align-items-baseline mb-2">
        <span class="publication-index me-2" style="color: #667eea; font-weight: 600; font-size: 0.9rem;">[{{ forloop.index }}]</span>
        <h4 class="h6 mb-0 fw-bold">{{ pub.title }}</h4>
    </div>
    <p class="text-muted small mb-2"><strong>Authors:</strong> {{ pub.authors | markdownify }}</p>
    <p class="small mb-2">{{ pub.journal }}</p>
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
            <div class="btn btn-sm btn-outline-info" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">{{ pub.media_link | markdownify }}</div>
        {% endif %}
    </div>
</div>
{% endfor %}
