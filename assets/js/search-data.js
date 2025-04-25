
const currentUrl = window.location.href;
const siteUrl = "https://george-gca.github.io"; 
let updatedUrl = currentUrl.replace("https://george-gca.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("".length > 0) {
  updatedUrl = updatedUrl.replace("/", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-bio",
    title: "Bio",
    section: "Navigation menu",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Selected publications",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "My public repositories and Github statistics",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum Vitae",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-analyzing-the-history-of-cvpr",
        
          title: "Analyzing the history of CVPR",
        
        description: "A look at the history of CVPR and its workshops from 2017 to 2024.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cvpr-history-analysis/";
          
        },
      },{id: "post-sli-dev-for-non-web-developers",
        
          title: "sli.dev for non-web developers",
        
        description: "How to setup and use sli.dev for non-web developers",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/slidev_for_non_web_devs/";
          
        },
      },{id: "post-improving-your-python-code-with-simple-tricks",
        
          title: "Improving your python code with simple tricks",
        
        description: "How to use functions from the default library to improve your code.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/simple-improvements-python-code/";
          
        },
      },{id: "post-the-problem-of-research-code-reproducibility",
        
          title: "The problem of research code reproducibility",
        
        description: "A brief overview of the problem of research code reproducibility.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/research-code-reproducibility/";
          
        },
      },{id: "post-creating-localized-blog-posts",
        
          title: "Creating localized blog posts",
        
        description: "How to create localized blog on your al-folio website.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/localized-blog/";
          
        },
      },{id: "post-creating-localized-projects-pages",
        
          title: "Creating localized Projects pages",
        
        description: "How to create localized Projects pages on your al-folio website.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/localized-projects/";
          
        },
      },{id: "post-creating-localized-cv-pages",
        
          title: "Creating localized CV pages",
        
        description: "How to create localized CV pages on your al-folio website.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/localized-cv/";
          
        },
      },{id: "post-turning-your-al-folio-into-a-dual-language-website",
        
          title: "Turning your al-folio into a dual-language website",
        
        description: "Adding support for another language in your al-folio.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/dual-language-al-folio/";
          
        },
      },{id: "post-running-locally-your-own-al-folio-website",
        
          title: "Running locally your own al-folio website",
        
        description: "Step by step on how to run your own al-folio locally.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/running-local-al-folio/";
          
        },
      },{
        id: 'social-email',
        title: 'Send an email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%67%65%6F%72%67%65.%61%72%61%75%6A%6F@%69%63.%75%6E%69%63%61%6D%70.%62%72", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-7658-2786", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=kSVOrakAAAAJ", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/George-De-Araujo/", "_blank");
        },
      },{
        id: 'social-dblp',
        title: 'DBLP',
        section: 'Socials',
        handler: () => {
          window.open("https://dblp.org/pid/331/0630.html", "_blank");
        },
      },{
        id: 'social-lattes',
        title: 'Lattes',
        section: 'Socials',
        handler: () => {
          window.open("http://lattes.cnpq.br/8522827733075951", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/george-gca", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/georgecdearaujo", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
          id: 'lang-pt-br',
          title: 'pt-br',
          section: 'Languages',
          handler: () => {
            window.location.href = "/pt-br" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
