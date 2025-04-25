
const currentUrl = window.location.href;
const siteUrl = "https://george-gca.github.io"; 
let updatedUrl = currentUrl.replace("https://george-gca.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("pt-br".length > 0) {
  updatedUrl = updatedUrl.replace("/pt-br", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-bio",
    title: "Bio",
    section: "Menu de navegação",
    handler: () => {
      window.location.href = "/pt-br/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/pt-br/blog/";
          },
        },{id: "nav-publicações",
          title: "Publicações",
          description: "Publicações selecionadas",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/pt-br/publications/";
          },
        },{id: "nav-repositórios",
          title: "Repositórios",
          description: "Meus repositórios públicos e estatísticas do Github",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/pt-br/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum Vitae",
          section: "Menu de navegação",
          handler: () => {
            window.location.href = "/pt-br/cv/";
          },
        },{id: "post-analizando-o-histórico-do-cvpr",
        
          title: "Analizando o histórico do CVPR",
        
        description: "Uma análise do histórico do CVPR e seus workshops de 2017 a 2024.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2025/cvpr-history-analysis/";
          
        },
      },{id: "post-sli-dev-para-desenvolvedores-não-web",
        
          title: "sli.dev para desenvolvedores não web",
        
        description: "Como configurar e usar sli.dev para desenvolvedores que não são web",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2023/slidev_for_non_web_devs/";
          
        },
      },{id: "post-melhorando-seu-código-python-com-truques-simples",
        
          title: "Melhorando seu código Python com truques simples",
        
        description: "Como usar funções da biblioteca padrão para melhorar seu código.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2023/simple-improvements-python-code/";
          
        },
      },{id: "post-o-problema-da-reproducibilidade-de-códigos-de-pesquisa",
        
          title: "O problema da reproducibilidade de códigos de pesquisa",
        
        description: "Uma breve visão geral do problema da reproducibilidade de códigos de pesquisa.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/research-code-reproducibility/";
          
        },
      },{id: "post-criando-postagens-de-blog-traduzidas",
        
          title: "Criando postagens de blog traduzidas",
        
        description: "Como criar um blog traduzido no seu site al-folio.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/localized-blog/";
          
        },
      },{id: "post-criando-páginas-de-projetos-traduzidas",
        
          title: "Criando páginas de projetos traduzidas",
        
        description: "Como criar páginas de projetos traduzidas em seu site al-folio.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/localized-projects/";
          
        },
      },{id: "post-criando-páginas-de-cv-traduzidas",
        
          title: "Criando páginas de CV traduzidas",
        
        description: "Como criar páginas de CV por idioma no seu site al-folio.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/localized-cv/";
          
        },
      },{id: "post-tornando-seu-al-folio-em-um-site-com-dois-idiomas",
        
          title: "Tornando seu al-folio em um site com dois idiomas",
        
        description: "Adicionando suporte para outro idioma em seu al-folio.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/dual-language-al-folio/";
          
        },
      },{id: "post-executando-localmente-seu-próprio-site-al-folio",
        
          title: "Executando localmente seu próprio site al-folio",
        
        description: "Passo a passo sobre como executar seu próprio al-folio localmente.",
        section: "Postagens",
        handler: () => {
          
            window.location.href = "/pt-br/blog/2022/running-local-al-folio/";
          
        },
      },{
        id: 'social-email',
        title: 'Enviar um email',
        section: 'Redes sociais',
        handler: () => {
          window.open("mailto:%67%65%6F%72%67%65.%61%72%61%75%6A%6F@%69%63.%75%6E%69%63%61%6D%70.%62%72", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://orcid.org/0000-0002-7658-2786", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=kSVOrakAAAAJ", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://www.researchgate.net/profile/George-De-Araujo/", "_blank");
        },
      },{
        id: 'social-dblp',
        title: 'DBLP',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://dblp.org/pid/331/0630.html", "_blank");
        },
      },{
        id: 'social-lattes',
        title: 'Lattes',
        section: 'Redes sociais',
        handler: () => {
          window.open("http://lattes.cnpq.br/8522827733075951", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://github.com/george-gca", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Redes sociais',
        handler: () => {
          window.open("https://www.linkedin.com/in/georgecdearaujo", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Redes sociais',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
          id: 'lang-en-us',
          title: 'en-us',
          section: 'Idiomas',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Muda o tema para claro',
      description: 'Muda o tema do site para claro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Muda o tema para escuro',
      description: 'Muda o tema do site para escuro',
      section: 'Tema',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Usa o tema padrão do sistema',
      description: 'Muda o tema do site para o padrão do sistema',
      section: 'Tema',
      handler: () => {
        setThemeSetting("system");
      },
    },];
