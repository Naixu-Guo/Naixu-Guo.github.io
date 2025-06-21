---
layout: default
title: "Research"
permalink: /research/
---

<!-- Research Header -->
<section class="hero-section-small py-4" style="margin-top: 90px;">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto text-center">
                <h1 id="research" class="display-5 fw-bold mb-2">Research</h1>
            </div>
        </div>
    </div>
</section>

<!-- Research Directions -->
<section class="research-section py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 mx-auto">
                
                <!-- Research Direction 1 -->
                <div class="research-direction mb-5">
                    <div class="research-header mb-4">
                        <h2 class="h3 fw-bold text-primary mb-2">Quantum Machine Learning: Bridging Classical and Quantum Worlds</h2>
                    </div>
                    
                    <div class="research-content">
                        <p class="lead mb-3">
                            My journey into quantum machine learning began with a simple question: <em>How can we harness the unique properties of quantum systems to solve problems that classical computers struggle with?</em>
                        </p>
                        
                        <p class="mb-3">
                            In classical machine learning, we're limited by the computational complexity of certain algorithms. But quantum computers offer a fundamentally different approach—they can process information in superposition and leverage quantum entanglement to explore vast solution spaces simultaneously.
                        </p>
                        
                        <p class="mb-3">
                            My research focuses on developing <strong>variational quantum circuits</strong> that can learn complex patterns in data. These circuits are like quantum neural networks, where the parameters are optimized through a hybrid quantum-classical approach. The beauty of this method is that it can potentially solve problems in optimization, chemistry, and finance that would take classical computers centuries to process.
                        </p>
                        
                        <div class="research-highlights bg-light p-3 rounded mb-3">
                            <h6 class="fw-bold mb-2">Key Contributions:</h6>
                            <ul class="mb-0 small">
                                <li>Developed novel quantum neural network architectures for image recognition</li>
                                <li>Pioneered hybrid quantum-classical algorithms for drug discovery</li>
                                <li>Created efficient quantum optimization techniques for combinatorial problems</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Research Direction 2 -->
                <div class="research-direction mb-5">
                    <div class="research-header mb-4">
                        <h2 class="h3 fw-bold text-success mb-2">Quantum Error Correction: Building Reliable Quantum Computers</h2>
                    </div>
                    
                    <div class="research-content">
                        <p class="lead mb-3">
                            Quantum computers are incredibly powerful, but they're also incredibly fragile. A single stray photon or temperature fluctuation can destroy the delicate quantum states we're trying to manipulate. This is where quantum error correction comes in.
                        </p>
                        
                        <p class="mb-3">
                            My work in this area addresses one of the biggest challenges in quantum computing: <strong>noise</strong>. Current quantum devices operate in what we call the "NISQ" era—Noisy Intermediate-Scale Quantum. These devices have enough qubits to do interesting things, but they're too noisy to be reliable for practical applications.
                        </p>
                        
                        <p class="mb-3">
                            I'm developing error correction schemes that can protect quantum information even in noisy environments. Think of it like building a quantum version of error-correcting codes that protect your data when you send it over the internet, but for quantum states instead of classical bits.
                        </p>
                        
                        <div class="research-highlights bg-light p-3 rounded mb-3">
                            <h6 class="fw-bold mb-2">Key Contributions:</h6>
                            <ul class="mb-0 small">
                                <li>Designed surface code-based error correction for fault-tolerant computing</li>
                                <li>Developed noise-adaptive error mitigation strategies</li>
                                <li>Created practical error correction protocols for NISQ devices</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Research Direction 3 -->
                <div class="research-direction mb-5">
                    <div class="research-header mb-4">
                        <h2 class="h3 fw-bold text-info mb-2">Quantum-Classical Hybrid Systems: The Best of Both Worlds</h2>
                    </div>
                    
                    <div class="research-content">
                        <p class="lead mb-3">
                            While quantum computers are powerful, they're not always the best tool for every job. Sometimes the most effective approach is to combine quantum and classical computing in intelligent ways.
                        </p>
                        
                        <p class="mb-3">
                            My research in hybrid systems explores how we can use quantum computers for the parts of a problem where they excel (like simulating quantum systems or solving certain optimization problems) while using classical computers for everything else. This approach is particularly promising for <strong>autonomous systems</strong> and <strong>reinforcement learning</strong>.
                        </p>
                        
                        <p class="mb-3">
                            Imagine a self-driving car that uses quantum algorithms to make split-second decisions about complex traffic scenarios, or a robot that uses quantum reinforcement learning to adapt to new environments. These are the kinds of applications that hybrid systems could enable.
                        </p>
                        
                        <div class="research-highlights bg-light p-3 rounded mb-3">
                            <h6 class="fw-bold mb-2">Key Contributions:</h6>
                            <ul class="mb-0 small">
                                <li>Developed quantum reinforcement learning algorithms for autonomous systems</li>
                                <li>Created hybrid optimization frameworks for real-world applications</li>
                                <li>Pioneered quantum-classical interfaces for practical deployment</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>

<style>
.hero-section-small {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.research-section {
    background-color: #f8f9fa;
}

.research-direction {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.research-direction:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.research-header {
    border-bottom: 3px solid #e9ecef;
    padding-bottom: 1rem;
}

.text-primary {
    color: #667eea !important;
}

.text-success {
    color: #28a745 !important;
}

.text-info {
    color: #17a2b8 !important;
}

.bg-primary {
    background-color: #667eea !important;
}

.research-highlights {
    border-left: 4px solid #667eea;
}
</style> 