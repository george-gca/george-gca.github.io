require "nokogiri"

Jekyll::Hooks.register([:pages, :posts], :post_render) do |page|
    if page.site.config.key?("animation")
        config = page.site.config["animation"]

        if config.key?("enabled") and config["enabled"]
            if config.key?("verbose")
                verbose = config["verbose"]
            else
                verbose = false
            end

            if page.path.end_with?(".html", ".md")
                noko = Nokogiri::HTML(page.output)

                if config.key?("selector")
                    selector = config["selector"]
                else
                    selector = "audio, blockquote, div.card, div.highlighter-rouge, div.news, div.repositories, div.row, div.social, div.tag-category-list, figure, h2, h3, p, tr, video"
                end

                if config.key?("max_elements")
                    limit = config["max_elements"]
                else
                    limit = -1
                end

                noko.search(selector).each_with_index do |tag, index|
                    tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
                    tag["data-animate"] = ""
                    if index == limit then
                        break
                    end
                end

                page.output  = noko.to_html
                if verbose
                    Jekyll.logger.info "Added animation to page #{page.path}"
                end

            elsif page.path.end_with?(".scss")
                if config.key?("delay")
                    delay = config["delay"]
                else
                    delay = "100ms"
                end

                css = page.output
                css += "@keyframes enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}[data-animate]{--stagger:0;--delay:#{delay};--start:0ms}
@media(prefers-reduced-motion:no-preference){[data-animate]{animation:enter .6s both;animation-delay: calc(var(--stagger) * var(--delay) + var(--start))}}"
                page.output = css

                if verbose
                    puts "Added animation to css file #{page.path}"
                end

            elsif verbose
                Jekyll.logger.info "Skipped adding animation to page #{page.path}"
            end
        end
    end
end
