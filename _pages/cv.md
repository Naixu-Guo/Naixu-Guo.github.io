---
title: "CV"
permalink: /cv/
---

# Curriculum Vitae

## Education
{% for edu in site.data.cv.education %}
<div class="cv-item mb-3">
    <h4>{{ edu.degree }}</h4>
    <p class="text-muted mb-1">{{ edu.institution }}, {{ edu.year }}</p>
    <p>{{ edu.description }}</p>
</div>
{% endfor %}

## Experience
{% for exp in site.data.cv.experience %}
<div class="cv-item mb-3">
    <h4>{{ exp.position }}</h4>
    <p class="text-muted mb-1">{{ exp.institution }}, {{ exp.year }}</p>
    <p>{{ exp.description }}</p>
</div>
{% endfor %}

## Skills

### Technical Skills
<div class="mb-3">
    {% for skill in site.data.cv.skills.technical %}
    <span class="badge bg-primary me-1">{{ skill }}</span>
    {% endfor %}
</div>

### Quantum Computing
<div class="mb-3">
    {% for skill in site.data.cv.skills.quantum %}
    <span class="badge bg-success me-1">{{ skill }}</span>
    {% endfor %}
</div>

### Languages
<div class="mb-3">
    {% for skill in site.data.cv.skills.languages %}
    <span class="badge bg-info me-1">{{ skill }}</span>
    {% endfor %}
</div>

