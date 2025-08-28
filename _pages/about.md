---
title: "About"
permalink: /about/
---

# Naixu Guo

<div class="row">
  <div class="col-sm-4">
    <img src="{{ site.baseurl }}/photo.jpg" alt="Naixu Guo" class="img-fluid rounded" style="width: 200px; height: 200px;">
  </div>
  <div class="col-sm-8">
    <p class="lead">I am a researcher in quantum computing and machine learning, currently working on quantum algorithms for optimization and machine learning tasks.</p>
    
    <h3>Recent News</h3>
    {% assign news = site.data.news | slice: 0, 5 %}
    {% for item in news %}
    <div class="news-item mb-2">
      {{ item.content | markdownify }}
    </div>
    {% endfor %}
  </div>
</div>

