require "nokogiri"

Jekyll::Hooks.register([:pages, :posts], :post_render) do |page|
    if page.path.end_with?(".html", ".md")
        noko = Nokogiri::HTML(page.output)
        noko.search("audio, blockquote, div.card, div.highlighter-rouge, div.news, div.repositories, div.row, div.social, div.tag-category-list, figure, h2, h3, p, tr, video").each_with_index do |tag, index|
            tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
            tag["data-animate"] = ""
            # stop after 20 elements
            if index == 20 then
                break
            end
        end

        page.output  = noko.to_html
        # Jekyll.logger.info "Adding animation to page #{page.path}"

    else
        Jekyll.logger.info "Skipped adding animation to page #{page.path}"
    end
end