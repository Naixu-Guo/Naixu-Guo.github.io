---
title: "{{ site.data.cv.title }}"
permalink: /cv/
---

# {{ site.data.cv.title }}

<p class="lead">{{ site.data.cv.subtitle }}</p>

<!-- Personal Information -->
<div class="personal-info-section mb-5">
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-transparent border-0">
      <div class="text-center">
        <h2 class="h2 mb-2 text-primary">
          {{ site.data.cv.personal_info.name }}
        </h2>
        <p class="h5 text-muted mb-3">
          {{ site.data.cv.personal_info.title }}
        </p>
        <p class="h6 text-muted mb-4">
          {{ site.data.cv.personal_info.institution }}
        </p>
        
        <div class="d-flex justify-content-center align-items-center gap-4 text-muted">
          {% if site.data.cv.personal_info.email %}
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-envelope"></i>
            <span>{{ site.data.cv.personal_info.email }}</span>
          </div>
          {% endif %}
          {% if site.data.cv.personal_info.phone %}
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-phone"></i>
            <span>{{ site.data.cv.personal_info.phone }}</span>
          </div>
          {% endif %}
          {% if site.data.cv.personal_info.location %}
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ site.data.cv.personal_info.location }}</span>
          </div>
          {% endif %}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- CV Sections -->
{% for section in site.data.cv.sections %}
<div class="cv-section mb-5 {% cycle 'bg-light', 'bg-white' %}">
  <div class="p-4">
    <h2 class="h3 mb-4 text-primary">{{ section.title }}</h2>
    
    <div class="space-y-4">
      {% for item in section.items %}
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h3 class="h5 mb-0 fw-bold text-dark">
              {{ item.title }}
            </h3>
            {% if item.duration %}
            <span class="text-muted fw-medium">
              {{ item.duration }}
            </span>
            {% endif %}
          </div>
          
          {% if item.institution %}
          <p class="text-muted fw-medium mb-2">
            {{ item.institution }}
          </p>
          {% endif %}
          
          {% if item.details %}
          <p class="text-muted mb-0">
            {{ item.details }}
          </p>
          {% endif %}
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
{% endfor %}

<style>
.personal-info-section .card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.cv-section.bg-light {
  background-color: #f8f9fa !important;
  padding: 2rem;
  margin: 0 -2rem;
  border-radius: 0.5rem;
}

.cv-section.bg-white {
  background-color: white !important;
  padding: 2rem;
  margin: 0 -2rem;
  border-radius: 0.5rem;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.text-primary { color: #007bff !important; }
.text-muted { color: #6c757d !important; }
.text-dark { color: #212529 !important; }

.fw-medium { font-weight: 500 !important; }
.fw-bold { font-weight: 700 !important; }

.space-y-4 > * + * {
  margin-top: 1.5rem;
}

.gap-2 { gap: 0.5rem !important; }
.gap-4 { gap: 1rem !important; }
</style>

