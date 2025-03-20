// Add this at the beginning of the file
document.addEventListener('DOMContentLoaded', function() {
    // Prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Prevent Ctrl+C, Ctrl+V, Ctrl+S, Ctrl+U, F12
        if (
            (e.ctrlKey && (e.keyCode === 67 || 
                          e.keyCode === 86 || 
                          e.keyCode === 83 || 
                          e.keyCode === 85)) || 
            e.keyCode === 123
        ) {
            e.preventDefault();
            return false;
        }
    });

    // Prevent right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent dragging images
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Fix scrolling issues - prevent pull-to-refresh but allow normal scrolling
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollableElement = findScrollableParent(e.target);
        
        // If we're at the top of a scrollable element and trying to pull down
        if (scrollableElement && 
            scrollableElement.scrollTop === 0 && 
            touchY > touchStartY) {
            e.preventDefault();
        }
        
        // If we're at the bottom of a scrollable element and trying to pull up
        if (scrollableElement && 
            scrollableElement.scrollHeight - scrollableElement.scrollTop <= scrollableElement.clientHeight + 10 && 
            touchY < touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Helper function to find scrollable parent
    function findScrollableParent(element) {
        if (!element) return null;
        
        const { overflowY } = window.getComputedStyle(element);
        const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
        
        if (isScrollable && element.scrollHeight > element.clientHeight) {
            return element;
        }
        
        return findScrollableParent(element.parentElement) || document.querySelector('.app');
    }
    
    // Apply active class to modals for animations
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const originalDisplay = modal.style.display;
        
        Object.defineProperty(modal.style, 'display', {
            set: function(value) {
                this.cssText = this.cssText.replace(/display:\s*[^;]+/, `display: ${value}`);
                if (value === 'flex' || value === 'block') {
                    setTimeout(() => modal.classList.add('active'), 10);
                } else {
                    modal.classList.remove('active');
                }
            },
            get: function() {
                return window.getComputedStyle(modal).display;
            }
        });
    });
    
    // Add touch feedback for mobile devices
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.tool-card, .primary-btn, .icon-btn, .category-btn, .nav-btn')) {
            e.target.closest('.tool-card, .primary-btn, .icon-btn, .category-btn, .nav-btn').classList.add('touch-active');
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const activeElements = document.querySelectorAll('.touch-active');
        activeElements.forEach(el => el.classList.remove('touch-active'));
    }, { passive: true });
    
    // Fix horizontal scrolling in category filter
    const categoryFilter = document.querySelector('.category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
    
    // Initialize app after DOM is loaded
    initializeApp();
});

// Add disclaimer functions
function showDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Add click outside to close for disclaimer
document.getElementById('disclaimer-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDisclaimer();
    }
});

// Base configuration and data
const tools = [
    // Chat & Communication
    {
        name: "ChatGPT",
        category: "Chat",
        url: "https://chat.openai.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/chat_openai_com_.png?raw=true",
        description: "Advanced AI chatbot for natural conversations and assistance"
    },
    {
        name: "Claude",
        category: "Chat",
        url: "https://claude.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/claude_ai_.png?raw=true",
        description: "Anthropic's advanced AI assistant for complex tasks and analysis"
    },
    {
        name: "Gemini",
        category: "Chat",
        url: "https://gemini.google.com/app",
        image: "https://github.com/newinjection/screenshotsai/blob/main/gemini_google_com_app.png?raw=true",
        description: "Google's AI chatbot for creative and analytical conversations"
    },
    {
        name: "Character AI",
        category: "Chat",
        url: "https://character.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/character_ai_.png?raw=true",
        description: "Chat with AI-powered characters and personalities"
    },
    // Image Creation
    {
        name: "Midjourney",
        category: "Image Creation",
        url: "https://www.midjourney.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_midjourney_com_.png?raw=true",
        description: "Create stunning artwork using AI with detailed text prompts"
    },
    {
        name: "DALL-E 3",
        category: "Image Creation",
        url: "https://openai.com/dall-e-3",
        image: "https://github.com/newinjection/screenshotsai/blob/main/openai_com_dall_e_3.png?raw=true",
        description: "Latest version of OpenAI's image generation model"
    },
    {
        name: "Stable Diffusion",
        category: "Image Creation",
        url: "https://stability.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/stability_ai_.png?raw=true",
        description: "Open-source image generation with amazing capabilities"
    },
    {
        name: "Leonardo.ai",
        category: "Image Creation",
        url: "https://leonardo.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/leonardo_ai_.png?raw=true",
        description: "AI art generation optimized for game assets and design"
    },
    {
        name: "Lensa",
        category: "Image Editing",
        url: "https://prisma-ai.com/lensa",
        image: "https://github.com/newinjection/screenshotsai/blob/main/prisma_ai_com_lensa.png?raw=true",
        description: "AI-powered photo editing and avatar creation"
    },
    {
        name: "Luminar Neo",
        category: "Image Editing",
        url: "https://skylum.com/luminar",
        image: "https://github.com/newinjection/screenshotsai/blob/main/skylum_com_luminar.png?raw=true",
        description: "AI-powered photo editor with advanced features"
    },
    {
        name: "Flair AI",
        category: "Design",
        url: "https://flair.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/flair_ai_.png?raw=true",
        description: "AI product photography and marketing visuals"
    },

    // Video Creation
    {
        name: "Runway",
        category: "Video Creation",
        url: "https://runway.ml/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/runway_ml_.png?raw=true",
        description: "Create and edit videos using AI magic"
    },
    {
        name: "Synthesia",
        category: "Video Creation",
        url: "https://www.synthesia.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_synthesia_io_.png?raw=true",
        description: "Create AI videos with virtual presenters"
    },
    {
        name: "D-ID",
        category: "Video Creation",
        url: "https://www.d-id.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_d_id_com_.png?raw=true",
        description: "Generate talking avatar videos from text"
    },
    {
        name: "Pika Labs",
        category: "Video Creation",
        url: "https://www.pika.art/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_pika_art_.png?raw=true",
        description: "Text-to-video generation platform"
    },
    {
        name: "Synthesia Avatar",
        category: "Video Creation",
        url: "https://www.synthesia.io/features/avatars",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_synthesia_io_features_avatars.png?raw=true",
        description: "Create AI-powered video presentations with virtual avatars"
    },
    {
        name: "Descript",
        category: "Video Creation",
        url: "https://www.descript.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_descript_com_.png?raw=true",
        description: "AI-powered video and audio editing"
    },
    {
        name: "Pictory",
        category: "Video Creation",
        url: "https://pictory.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/pictory_ai_.png?raw=true",
        description: "Convert text to video using AI"
    },
    {
        name: "Kaiber",
        category: "Video Creation",
        url: "https://kaiber.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/kaiber_ai_.png?raw=true",
        description: "AI-powered video generation and enhancement"
    },
    {
        name: "Fliki",
        category: "Video Creation",
        url: "https://fliki.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/fliki_ai_.png?raw=true",
        description: "Turn text into videos with AI voices"
    },
    {
        name: "Veed.io",
        category: "Video Editing",
        url: "https://www.veed.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_veed_io_.png?raw=true",
        description: "AI-powered online video editor"
    },
    {
        name: "Lumen5",
        category: "Video Creation",
        url: "https://lumen5.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/lumen5_com_.png?raw=true",
        description: "Transform text into video presentations"
    },
    // Audio & Music
    {
        name: "Murf AI",
        category: "Voice",
        url: "https://murf.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/murf_ai_.png?raw=true",
        description: "AI voice generation for professional voiceovers"
    },
    {
        name: "ElevenLabs",
        category: "Voice",
        url: "https://elevenlabs.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/elevenlabs_io_.png?raw=true",
        description: "Advanced AI voice generation and cloning"
    },
    {
        name: "Soundraw",
        category: "Music",
        url: "https://soundraw.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/soundraw_io_.png?raw=true",
        description: "AI music generation for content creators"
    },
    {
        name: "Otter.ai",
        category: "Transcription",
        url: "https://otter.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/otter_ai_.png?raw=true",
        description: "AI-powered meeting notes and voice transcription"
    },
    {
        name: "Krisp",
        category: "Transcription",
        url: "https://krisp.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/krisp_ai_.png?raw=true",
        description: "AI noise cancellation for calls and recordings"
    },
    {
        name: "Speechify",
        category: "Voice",
        url: "https://speechify.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/speechify_com_.png?raw=true",
        description: "Turn text into natural-sounding speech"
    },
    {
        name: "Cleanvoice",
        category: "Audio",
        url: "https://cleanvoice.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/cleanvoice_ai_.png?raw=true",
        description: "Remove filler sounds from audio recordings"
    },
    {
        name: "Riffusion",
        category: "Music",
        url: "https://www.riffusion.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_riffusion_com_.png?raw=true",
        description: "AI music generation from text prompts"
    },
    {
        name: "Suno",
        category: "Music",
        url: "https://suno.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/suno_ai_.png?raw=true",
        description: "Create original music with AI"
    },
    {
        name: "Fireflies.ai",
        category: "Transcription",
        url: "https://fireflies.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/fireflies_ai_.png?raw=true",
        description: "AI meeting recorder and transcriber"
    },
    {
        name: "AssemblyAI",
        category: "Speech Recognition",
        url: "https://www.assemblyai.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_assemblyai_com_.png?raw=true",
        description: "Speech recognition and audio intelligence API"
    },
    
    // Writing & Content
    {
        name: "Jasper",
        category: "Writing",
        url: "https://www.jasper.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_jasper_ai_.png?raw=true",
        description: "AI writing assistant for marketing and content"
    },
    {
        name: "Copy.ai",
        category: "Writing",
        url: "https://www.copy.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_copy_ai_.png?raw=true",
        description: "Generate marketing copy and content with AI"
    },
    {
        name: "Grammarly",
        category: "Writing",
        url: "https://www.grammarly.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_grammarly_com_.png?raw=true",
        description: "AI-powered writing assistance and correction"
    },
    {
        name: "Writesonic",
        category: "Writing",
        url: "https://writesonic.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/writesonic_com_.png?raw=true",
        description: "AI content writing and marketing copy generator"
    },
    {
        name: "Rytr",
        category: "Writing",
        url: "https://rytr.me/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/rytr_me_.png?raw=true",
        description: "AI writing assistant for content creation"
    },
    {
        name: "Wordtune",
        category: "Voice",
        url: "https://www.wordtune.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_wordtune_com_.png?raw=true",
        description: "AI writing companion for rewording and editing"
    },
    {
        name: "Typeface",
        category: "Content Creation",
        url: "https://typeface.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/typeface_ai_.png?raw=true",
        description: "AI content creation platform for brands"
    },
    
    // Development Tools
    {
        name: "GitHub Copilot",
        category: "Development",
        url: "https://github.com/features/copilot",
        image: "https://github.com/newinjection/screenshotsai/blob/main/github_com_features_copilot.png?raw=true",
        description: "AI pair programmer for developers"
    },
    {
        name: "Tabnine",
        category: "Development",
        url: "https://www.tabnine.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_tabnine_com_.png?raw=true",
        description: "AI code completion for multiple languages"
    },
    {
        name: "Replit Ghost",
        category: "Development",
        url: "https://replit.com/site/ghost",
        image: "https://github.com/newinjection/screenshotsai/blob/main/replit_com_site_ghost.png?raw=true",
        description: "AI coding assistant in Replit IDE"
    },
    {
        name: "Hugging Face",
        category: "Development",
        url: "https://huggingface.co/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/huggingface_co_.png?raw=true",
        description: "Open-source AI model repository and tools"
    },
    {
        name: "Replicate",
        category: "Development",
        url: "https://replicate.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/replicate_com_.png?raw=true",
        description: "Run open-source AI models in the cloud"
    },
    {
        name: "Codeium",
        category: "Development",
        url: "https://codeium.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/codeium_com_.png?raw=true",
        description: "AI coding assistant and autocomplete"
    },
    {
        name: "Sourcegraph Cody",
        category: "Development",
        url: "https://sourcegraph.com/cody",
        image: "https://github.com/newinjection/screenshotsai/blob/main/sourcegraph_com_cody.png?raw=true",
        description: "AI coding assistant for developers"
    },
    {
        name: "Mintlify",
        category: "Development",
        url: "https://mintlify.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/mintlify_com_.png?raw=true",
        description: "AI-powered documentation generator"
    },
    {
        name: "Vercel AI SDK",
        category: "Development",
        url: "https://vercel.com/ai",
        image: "https://github.com/newinjection/screenshotsai/blob/main/vercel_com_ai.png?raw=true",
        description: "Tools for building AI-powered applications"
    },
    {
        name: "Weights & Biases",
        category: "Development",
        url: "https://wandb.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/wandb_ai_.png?raw=true",
        description: "MLOps platform for tracking AI experiments"
    },
    {
        name: "Langchain",
        category: "Development",
        url: "https://www.langchain.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_langchain_com_.png?raw=true",
        description: "Framework for developing LLM applications"
    },
    {
        name: "Roboflow",
        category: "Computer Vision",
        url: "https://roboflow.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/roboflow_com_.png?raw=true",
        description: "Computer vision model training platform"
    },
    {
        name: "Scale AI",
        category: "Data Labeling",
        url: "https://scale.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/scale_com_.png?raw=true",
        description: "Data labeling platform for AI training"
    },
    
    // Design Tools
    {
        name: "Figma AI",
        category: "Design",
        url: "https://www.figma.com/ai",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_figma_com_ai.png?raw=true",
        description: "AI-powered design features in Figma"
    },
    {
        name: "Canva AI",
        category: "Design",
        url: "https://www.canva.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_canva_com_.png?raw=true",
        description: "AI design tools for easy graphic creation"
    },
    {
        name: "Adobe Firefly",
        category: "Design",
        url: "https://www.adobe.com/products/firefly.html",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_adobe_com_products_firefly_html.png?raw=true",
        description: "Adobe's AI creative suite for design"
    },
    {
        name: "Flourish",
        category: "Design",
        url: "https://flourish.studio/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/flourish_studio_.png?raw=true",
        description: "Create data visualizations with AI assistance"
    },
    {
        name: "Framer AI",
        category: "Website Builder",
        url: "https://www.framer.com/ai",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_framer_com_ai.png?raw=true",
        description: "AI website builder for designers"
    },
    {
        name: "Cohesive",
        category: "Design",
        url: "https://cohesive.so/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/cohesive_so_.png?raw=true",
        description: "AI-powered design tool for brand consistency"
    },
    
    // Productivity
    {
        name: "Notion AI",
        category: "Productivity",
        url: "https://www.notion.so/product/ai",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_notion_so_product_ai.png?raw=true",
        description: "AI writing and organization in Notion"
    },
    {
        name: "Mem.ai",
        category: "Productivity",
        url: "https://mem.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/mem_ai_.png?raw=true",
        description: "AI-powered personal knowledge base"
    },
    {
        name: "Taskade",
        category: "Productivity",
        url: "https://www.taskade.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_taskade_com_.png?raw=true",
        description: "AI-enhanced task and project management"
    },
    {
        name: "Timely",
        category: "Productivity",
        url: "https://timelyapp.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/timelyapp_com_.png?raw=true",
        description: "Automated time tracking with AI"
    },
    
    // Website Builders
    {
        name: "Durable",
        category: "Website Builder",
        url: "https://durable.co/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/durable_co_.png?raw=true",
        description: "AI website builder for small businesses"
    },
    {
        name: "Mixo",
        category: "Website Builder",
        url: "https://mixo.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/mixo_io_.png?raw=true",
        description: "Create a startup website with AI"
    },
    {
        name: "Appy Pie",
        category: "App Development",
        url: "https://www.appypie.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/appypie.png?raw=true",
        description: "No-code app builder with AI features"
    },
    
    // Presentations
    {
        name: "Beautiful.ai",
        category: "Presentations",
        url: "https://www.beautiful.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_beautiful_ai_.png?raw=true",
        description: "AI-powered presentation creation"
    },
    {
        name: "Gamma",
        category: "Presentations",
        url: "https://gamma.app/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/gamma_app_.png?raw=true",
        description: "Create presentations with AI assistance"
    },
    {
        name: "Tome",
        category: "Presentations",
        url: "https://tome.app/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/tome_app_.png?raw=true",
        description: "AI-powered storytelling and presentations"
    },
    
    // Research & Education
    {
        name: "Elicit",
        category: "Research",
        url: "https://elicit.org/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/elicit_org_.png?raw=true",
        description: "AI research assistant for academic papers"
    },
    {
        name: "Perplexity",
        category: "Research",
        url: "https://www.perplexity.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_perplexity_ai_.png?raw=true",
        description: "AI-powered search engine for research"
    },
    {
        name: "Research Rabbit",
        category: "Research",
        url: "https://www.researchrabbit.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_researchrabbit_ai_.png?raw=true",
        description: "AI-powered research paper discovery"
    },
    {
        name: "Caktus AI",
        category: "Education",
        url: "https://www.caktus.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_caktus_ai_.png?raw=true",
        description: "AI learning assistant for students"
    },
    {
        name: "Quizlet Q-Chat",
        category: "Education",
        url: "https://quizlet.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/quizlet.png?raw=true",
        description: "AI tutor for personalized learning"
    },

    // Translation & Language
    {
        name: "DeepL",
        category: "Translation",
        url: "https://www.deepl.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_deepl_com_.png?raw=true",
        description: "AI-powered language translation"
    },
    {
        name: "Lilt",
        category: "Translation",
        url: "https://lilt.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/lilt_com_.png?raw=true",
        description: "AI translation platform for enterprises"
    },
    {
        name: "Papercup",
        category: "Translation",
        url: "https://www.papercup.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_papercup_com_.png?raw=true",
        description: "AI dubbing and video translation"
    },

    // Business Tools
    {
        name: "Drift",
        category: "Business",
        url: "https://www.drift.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_drift_com_.png?raw=true",
        description: "AI-powered conversational marketing"
    },
    {
        name: "Gong.io",
        category: "Business",
        url: "https://www.gong.io/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_gong_io_.png?raw=true",
        description: "AI for sales conversation analytics"
    },
    {
        name: "Surfer SEO",
        category: "Business",
        url: "https://surferseo.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/surferseo_com_.png?raw=true",
        description: "AI-powered SEO content optimization"
    },
    {
        name: "Formaloo",
        category: "Business",
        url: "https://formaloo.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/formaloo.png?raw=true",
        description: "AI-powered form and survey builder"
    },
    {
        name: "Clearbit",
        category: "Business",
        url: "https://clearbit.com/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/clearbit_com_.png?raw=true",
        description: "AI-powered B2B data intelligence platform"
    },

    // Legal & Professional
    {
        name: "Spellbook",
        category: "Legal",
        url: "https://www.spellbook.legal/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_spellbook_legal_.png?raw=true",
        description: "AI assistant for legal contract drafting"
    },
    {
        name: "Harvey",
        category: "Legal",
        url: "https://www.harvey.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/www_harvey_ai_.png?raw=true",
        description: "AI legal assistant for law firms"
    },
    {
        name: "Resumaker",
        category: "Career",
        url: "https://resumaker.ai/",
        image: "https://github.com/newinjection/screenshotsai/blob/main/resumaker_ai_.png?raw=true",
        description: "AI resume builder and optimizer"
    }
]
// Initialize app state
let currentCategory = 'All';
let searchQuery = '';
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// DOM Elements
const toolsList = document.getElementById('tools-list');
const categoryFilter = document.getElementById('category-filter');
const welcomeBanner = document.getElementById('welcome-banner');
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clear-search');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    const userName = localStorage.getItem('userName');
    const modal = document.getElementById('name-modal');
    
    if (!userName) {
        // Only show modal if no name is stored
        modal.style.display = 'grid';
        const name = await askUserName();
        welcomeBanner.textContent = `Welcome, ${name}!`;
    } else {
        // Hide modal and show welcome message for returning users
        modal.style.display = 'none';
        welcomeBanner.textContent = `Welcome back, ${userName}!`;
    }
    
    renderCategories();
    renderTools();
    setupEventListeners();
}

function askUserName() {
    return new Promise((resolve) => {
        const modal = document.getElementById('name-modal');
        const input = document.getElementById('name-input');
        const submit = document.getElementById('name-submit');

        const handleSubmit = () => {
            const name = input.value.trim() || 'Guest';
            localStorage.setItem('userName', name);
            modal.style.display = 'none';
            
            // Remove event listeners to prevent memory leaks
            submit.removeEventListener('click', handleSubmit);
            input.removeEventListener('keypress', handleKeypress);
            
            resolve(name);
        };

        const handleKeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };

        submit.addEventListener('click', handleSubmit);
        input.addEventListener('keypress', handleKeypress);
        input.focus();
    });
}

function renderCategories() {
    const categories = ['All', ...new Set(tools.map(tool => tool.category))];
    categoryFilter.innerHTML = categories.map(category => `
        <button class="category-btn ${category === currentCategory ? 'active' : ''}"
                onclick="filterByCategory('${category}')">
            ${category}
        </button>
    `).join('');
}

function renderTools(filteredTools = tools) {
    toolsList.innerHTML = '';
    filteredTools.forEach(tool => {
        const card = createToolCard(tool);
        toolsList.appendChild(card);
    });
}

// Update the createToolCard function with direct link opening
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
        <div class="tool-image">
            <img src="${tool.image}" alt="${tool.name}" loading="lazy">
        </div>
        <div class="tool-content">
            <h3>${tool.name}</h3>
            <div class="tool-info">
                <span class="tool-category">${tool.category}</span>
            </div>
            <p class="tool-description">${tool.description}</p>
            <div class="card-actions">
                <button onclick="window.open('${tool.url}', '_blank')" class="primary-btn">
                    Open App
                </button>
                <button onclick="toggleFavorite('${tool.name}')" 
                        class="icon-btn ${favorites.includes(tool.name) ? 'active' : ''}">
                    ⭐
                </button>
            </div>
        </div>
    `;
    return card;
}

function filterByCategory(category) {
    currentCategory = category;
    
    renderCategories();
    filterTools();
}

function toggleFavorite(toolName) {
    const index = favorites.indexOf(toolName);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(toolName);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Filter tools based on current category and search
    filterTools();
}

// Update the openInApp function

function openInApp(url, toolName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Sanitize inputs
    const safeUrl = encodeURI(url);
    const safeName = toolName.replace(/[<>"/]/g, '');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">
                    <h3>${safeName}</h3>
                </div>
                <div class="modal-actions">
                    <button onclick="window.open('${safeUrl}', '_blank')" class="primary-btn">
                        Visit Site
                    </button>
                    <button onclick="closeModal()" class="icon-btn">✕</button>
                </div>
            </div>
            <div class="iframe-container">
                <iframe 
                    src="${safeUrl}" 
                    frameborder="0" 
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                    referrerpolicy="origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Update the closeModal function
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.remove();
    });
    document.body.style.overflow = '';
}

function setupEventListeners() {
    // Add search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim().toLowerCase();
            updateClearButton();
            filterTools();
        });
    }
    
    // Add clear button functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchQuery = '';
            updateClearButton();
            filterTools();
        });
    }
}

function updateClearButton() {
    if (clearSearchBtn) {
        if (searchQuery.length > 0) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
    }
}

function filterTools() {
    const filteredTools = tools.filter(tool => {
        const matchesCategory = currentCategory === 'All' || tool.category === currentCategory;
        const matchesSearch = searchQuery === '' || 
            tool.name.toLowerCase().includes(searchQuery) || 
            tool.description.toLowerCase().includes(searchQuery) ||
            tool.category.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });
    
    renderTools(filteredTools);
    
    // Show "no results" message if no tools match the search
    const noResultsMessage = document.getElementById('no-results-message');
    if (filteredTools.length === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'no-results-message';
            message.innerHTML = `
                <p>No tools found for "${searchQuery}"</p>
                <button class="primary-btn" onclick="clearSearch()">Clear Search</button>
            `;
            toolsList.appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function showHome() {
    currentCategory = 'All';
    renderCategories();
    renderTools();
}

function removeFavorite(toolName) {
    const index = favorites.indexOf(toolName);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Refresh favorites modal
        showFavorites();
        
        // Preserve current category and search when refreshing main view
        filterTools();
    }
}

function closeFavoritesModal() {
    const favoritesModal = document.getElementById('favorites-modal');
    favoritesModal.classList.remove('active');
    
    // Wait for animation to complete
    setTimeout(() => {
        favoritesModal.style.display = 'none';
        document.body.style.overflow = '';
    }, 200);
}

// Add this function after your existing functions

// Add this function after showFavorites()
function visitSite(url) {
    window.open(url, '_blank');
}

// Update the showFavorites function to properly display favorites
function showFavorites() {
    const favoriteTools = tools.filter(tool => favorites.includes(tool.name));
    const favoritesModal = document.getElementById('favorites-modal');
    const favoritesContainer = document.getElementById('favorites-container');
    
    if (favoritesContainer) {
        if (favoriteTools.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-favorites">
                    <p>No favorites yet! Click the ⭐ on any tool to add it to your favorites.</p>
                </div>
            `;
        } else {
            let favoritesHTML = '<div class="favorites-grid">';
            
            favoriteTools.forEach(tool => {
                favoritesHTML += `
                    <div class="favorite-item">
                        <div class="favorite-icon">
                            <img src="${tool.image}" alt="${tool.name}" loading="lazy">
                        </div>
                        <div class="favorite-info">
                            <h4>${tool.name}</h4>
                        </div>
                        <div class="favorite-actions">
                            <button onclick="window.open('${tool.url}', '_blank')" class="primary-btn">Open</button>
                            <button onclick="removeFavorite('${tool.name}')" class="icon-btn">×</button>
                        </div>
                    </div>
                `;
            });
            
            favoritesHTML += '</div>';
            favoritesContainer.innerHTML = favoritesHTML;
        }
    }
    
    favoritesModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add animation delay
    setTimeout(() => {
        favoritesModal.classList.add('active');
    }, 10);
}

// Add clear search function
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        updateClearButton();
        filterTools();
    }
}

function showHome() {
    currentCategory = 'All';
    renderCategories();
    renderTools();
}