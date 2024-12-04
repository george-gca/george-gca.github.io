# based on the excellent post by Anthony Fu: https://antfu.me/posts/sliding-enter-animation
require "nokogiri"

Jekyll::Hooks.register([:pages, :documents], :post_render) do |page|
    if page.site.config.key?("animation") and page.site.config["animation"].key?("enabled") and page.site.config["animation"]["enabled"]
        config = page.site.config["animation"]
        verbose = config["verbose"] || false

        if page.path.end_with?(".html", ".md")
            # add animation to html elements as style attribute
            noko = Nokogiri::HTML(page.output)

            # set default values
            limit = config["max_elements"] || 20
            selector = config["selector"] ||
                "audio, blockquote, div.card, div.highlighter-rouge, div.news, div.repositories, div.row, div.social, div.tag-category-list, figure, h2, h3, p, tr, video"

            noko.search(selector).each_with_index do |tag, index|
                tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
                tag["data-animate"] = ""
                if index == limit then
                    break
                end
            end

            page.output = noko.to_html
            if verbose
                Jekyll.logger.info "Added animation to page #{page.path}"
            end

        elsif page.path.end_with?(".scss")
            # add animation config to css file
            # set default values
            delay = config["delay"] || "100ms"
            duration = config["duration"] || "0.6s"
            name = config["name"] || "enter"

            from = config["from"] || "opacity:0;transform:translateY(10px)"
            # transform value to string, if it is a hash
            if from.is_a?(Hash)
                from = from.map { |k, v| "#{k}:#{v}" }.join(";")
            end

            to = config["to"] || "opacity:1;transform:none"
            # transform value to string, if it is a hash
            if to.is_a?(Hash)
                to = to.map { |k, v| "#{k}:#{v}" }.join(";")
            end

            css = page.output
            css += "@keyframes #{name}{from{#{from}}to{#{to}}}[data-animate]{--stagger:0;--delay:#{delay};--start:0.1ms}
@media(prefers-reduced-motion:no-preference){[data-animate]{animation:#{name} #{duration} both;animation-delay: calc(var(--stagger) * var(--delay) + var(--start))}}"
            page.output = css

            if verbose
                Jekyll.logger.info "Added animation to css file #{page.path}"
            end

        elsif verbose
            Jekyll.logger.info "Skipped adding animation to file #{page.path}"
        end
    end
end