---
title: "Mini Library"
permalink: /mini_lib/
---

# {{ site.data.mini_lib.title }}

<p class="lead">{{ site.data.mini_lib.subtitle }}</p>

{% for category in site.data.mini_lib.categories %}
<div class="category-section mb-5">
  <h2 class="h3 mb-3 text-primary">{{ category.title }}</h2>
  {% if category.description %}
    <p class="text-muted mb-4">{{ category.description }}</p>
  {% endif %}
  
  {% for subcategory in category.subcategories %}
    <div class="subcategory mb-4">
      <h3 class="h5 mb-3">{{ subcategory.title }}</h3>
      <div class="row">
        {% for item in subcategory.items %}
          <div class="col-md-6 mb-3">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="me-3">
                    {% case item.type %}
                      {% when 'book' %}
                        <i class="fas fa-book text-primary"></i>
                      {% when 'paper' %}
                        <i class="fas fa-file-alt text-success"></i>
                      {% when 'lecture_notes' %}
                        <i class="fas fa-graduation-cap text-info"></i>
                      {% when 'documentation' %}
                        <i class="fas fa-file-code text-warning"></i>
                      {% when 'tool' %}
                        <i class="fas fa-tools text-secondary"></i>
                      {% when 'paper_collection' %}
                        <i class="fas fa-folder-open text-danger"></i>
                      {% else %}
                        <i class="fas fa-link text-muted"></i>
                    {% endcase %}
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="card-title mb-2">
                      <a href="{{ item.link }}" target="_blank" class="text-decoration-none">
                        {{ item.title }}
                        <i class="fas fa-external-link-alt fa-xs text-muted ms-1"></i>
                      </a>
                    </h6>
                    <small class="text-muted text-uppercase">{{ item.type | replace: '_', ' ' }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</div>
{% endfor %}

<style>
.category-section:nth-child(even) {
  background-color: #f8f9fa;
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

.card-title a:hover {
  color: #0056b3 !important;
}

.text-primary { color: #007bff !important; }
.text-success { color: #28a745 !important; }
.text-info { color: #17a2b8 !important; }
.text-warning { color: #ffc107 !important; }
.text-secondary { color: #6c757d !important; }
.text-danger { color: #dc3545 !important; }
.text-muted { color: #6c757d !important; }
</style>
