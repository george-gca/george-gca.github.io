require "nokogiri"

Jekyll::Hooks.register([:pages, :posts], :post_render) do |page|
    if page.site.config.key?("animation")
        config = page.site.config["animation"]

        if config.key?("enabled") and config["enabled"]
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
                    # stop after 20 elements
                    if index == limit then
                        break
                    end
                end

                page.output  = noko.to_html
                # Jekyll.logger.info "Adding animation to page #{page.path}"

            else
                Jekyll.logger.info "Skipped adding animation to page #{page.path}"
            end
        end
    end
end