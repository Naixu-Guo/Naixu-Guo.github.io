---
title: "{{ site.data.research.title }}"
permalink: /research/
---

# {{ site.data.research.title }}

<p class="lead">{{ site.data.research.subtitle }}</p>

<div class="research-areas mt-5">
  <h2 class="h3 mb-4">Research Areas</h2>
  
  {% for area in site.data.research.research_areas %}
  <div class="research-area mb-5">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-0 pb-0">
        <h3 class="h4 mb-0 d-flex align-items-center">
          <i class="fas fa-{{ area.icon }} me-3 text-primary"></i>
          {{ area.title }}
        </h3>
      </div>
      <div class="card-body">
        <div class="research-description">
          {{ area.description | markdownify }}
        </div>
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<style>
.research-area .card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.research-area .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.research-description {
  line-height: 1.7;
}

.research-description h4,
.research-description h5,
.research-description h6 {
  color: #495057;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.research-description p {
  margin-bottom: 1rem;
  color: #6c757d;
}

.research-description strong {
  color: #495057;
}

.research-description ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.research-description li {
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.text-primary { color: #007bff !important; }

.card-header {
  background-color: #f8f9fa !important;
}

.fa-dna { color: #e83e8c !important; }
.fa-brain { color: #fd7e14 !important; }
</style>
