---
layout: default
title: "About"
permalink: /
---

<!-- Hero Section -->
<section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-top: 100px;">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
                <div class="profile-image mb-4">
                    <img src="/images/photo.jpg" alt="Naixu Guo" class="rounded-circle" style="width: 180px; height: 180px; object-fit: cover; border: 4px solid rgba(255,255,255,0.3);">
                </div>
                <h1 class="display-4 fw-bold mb-2 text-white" style="font-family: 'Georgia', serif; font-weight: 300; letter-spacing: 0.05em;">
                  Naixu Guo
                </h1>
                <div class="d-flex justify-content-center gap-3 mb-5">
                    <a href="mailto:naixu.guo@u.nus.edu" class="btn btn-outline-light">
                        <i class="fas fa-envelope me-2"></i>Email
                    </a>
                    <a href="https://scholar.google.com/citations?user=YOUR_ID" class="btn btn-outline-light">
                        <i class="fas fa-graduation-cap me-2"></i>Google Scholar
                    </a>
                    <a href="https://linkedin.com/in/naixu-guo" class="btn btn-outline-light">
                        <i class="fab fa-linkedin me-2"></i>LinkedIn
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section class="about-section py-2" style="background-color: #f8f9fa;">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <h2 class="section-title mb-4" style="color: #2c3e50;">About Me</h2>
                <div class="about-content">
                    <p class="lead mb-4" style="color: #34495e; line-height: 1.8;">
                        I am a fourth year PhD student at the Centre for Quantum Technologies (CQT), National University of Singapore, 
                        working under the supervision of <a href="https://scholar.google.com/citations?user=XWHSBmUAAAAJ&hl=en" target="_blank">Patrick Rebentrost</a> and <a href="https://scholar.google.com/citations?user=pER3wbkAAAAJ&hl=en" target="_blank">Miklos Santha</a>. 
                        My research aims to uncover and harness the fundamental computational principles of nature, especially quantum, to pioneer transformative algorithms and new paradigms of intelligence.
                        More information can be seen in this <a href="https://www.cqt.sg/highlight/2024-11-meet-guo-naixu/" target="_blank">interview</a>.
                        <strong>I'm on the job market this year, looking for postdoc and other positions starting 2026 Fall.</strong> <br>
                        For people who are interested to quantum machine learning, welcome to read our <a href="https://arxiv.org/abs/2502.01146" target="_blank">book</a>.
                    </p>
                    <p style="color: #34495e; line-height: 1.8;">
                        I earned my Bachelor's from Kyoto University and my Master's from Osaka University, where I was fortunate to be supervised by Keisuke Fujii and Kosuke Mitarai. 
                        My current work involves quantum linear algebra, quantum learning theory, and their applications in various domains.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- News Section -->
<section class="news-section py-2" style="background-color: white;">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <h2 class="section-title mb-4" style="color: #2c3e50;">Recent News</h2>
                <div class="news-content">
                  {% assign news = site.data.news | slice: 0, 5 %}
                  {% for item in news %}
                    <div class="news-item mb-3 p-3" style="border-left: 4px solid #667eea; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); box-shadow: 0 1px 5px rgba(0,0,0,0.05);">
                      <div class="d-flex align-items-start">
                        <div class="news-date me-3 fw-bold" style="min-width: 70px; color: #667eea; font-size: 0.9rem;">{{ item.date }}</div>
                        <div class="news-text" style="color: #34495e; font-size: 0.95rem;">{{ item.text | markdownify }}</div>
                      </div>
                    </div>
                  {% endfor %}
                </div>
            </div>
        </div>
    </div>
</section> 
