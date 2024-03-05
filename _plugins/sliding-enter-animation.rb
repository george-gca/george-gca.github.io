require "nokogiri"

# Jekyll::Hooks.register :pages, :post_convert do |page|
#     # Jekyll.logger.info "Page before:\n#{page.content}"

#     # only do this if page is an html or md page
#     if page.ext == ".html" || page.ext == ".md" then
#         noko = Nokogiri::HTML::fragment(page.content)
#         noko.css("audio", "div.highlighter-rouge", "figure", "h2", "h3", "p", "video").each_with_index do |tag, index|
#             tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
#             tag[:data_animate] = ""
#             if index == 10 then
#                 break
#             end
#         end

#         page.content = noko.to_html
#         # Jekyll.logger.info "Page after:\n#{page.content}"
#         Jekyll.logger.info "Added animation to page #{page.path}"
#     end
# end

# Jekyll::Hooks.register :posts, :post_convert do |post|
#     noko = Nokogiri::HTML::fragment(post.content)
#     noko.css("audio", "div.highlighter-rouge", "figure", "h2", "h3", "p", "video").each_with_index do |tag, index|
#         tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
#         tag[:data_animate] = ""
#         if index == 10 then
#             break
#         end
#     end

#     post.content = noko.to_html
#     Jekyll.logger.info "Added animation to post #{post.path}"
# end

# Jekyll::Hooks.register([:pages, :posts], :post_render) do |page|
# # Jekyll::Hooks.register([:pages, :posts], :post_convert) do |page|
#     # only do this if page is an html or md page
#     if page.path.end_with?("about.md")
#         Jekyll.logger.info "!!!!!!!!!!! Page before:\n#{page.output}"

#         if page.path.end_with?(".html", ".md")
#             noko = Nokogiri::HTML(page.output)
#             # noko = Nokogiri::HTML::fragment(page.content)
#             last_index = 0
#             Jekyll.logger.info "Trying to add animations to page #{page.path}"
#             noko.css("audio", "div.card", "div.highlighter-rouge", "figure", "h2", "h3", "p", "video").each_with_index do |tag, index|
#                 Jekyll.logger.info "\tAdded to: #{tag.name}"
#                 tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
#                 tag[:data_animate] = ""
#                 if index == 10 then
#                     break
#                 end
#                 last_index = index + 1
#             end

#             page.output  = noko.to_html
#             # page.content  = noko.to_html
#             Jekyll.logger.info "Added #{last_index} animations to page #{page.path}"

#             if page.path.end_with?("about.md")
#                 Jekyll.logger.info "!!!!!!!!!!! Page after:\n#{page.output}"
#             end
#         else
#             Jekyll.logger.info "Not adding animation to #{page.data['ext']} page #{page.path}"
#         end
#     end
# end

Jekyll::Hooks.register([:pages, :posts], :post_render) do |page|
    # Jekyll::Hooks.register([:pages, :posts], :post_convert) do |page|
        if page.path.end_with?(".html", ".md")
            noko = Nokogiri::HTML(page.output)
            # noko = Nokogiri::HTML::fragment(page.content)
            last_index = 0
            noko.css("audio", "div.card", "div.highlighter-rouge", "figure", "h2", "h3", "p", "video").each_with_index do |tag, index|
                tag[:style] = (tag[:style] || "") + "--stagger: #{index+1};"
                tag[:data_animate] = ""
                if index == 10 then
                    break
                end
                last_index = index + 1
            end

            page.output  = noko.to_html
            # page.content  = noko.to_html

        else
            Jekyll.logger.info "Not adding animation to #{page.data['ext']} page #{page.path}"
        end
    end