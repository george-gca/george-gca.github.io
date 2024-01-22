require "nokogiri"

Jekyll::Hooks.register :posts, :post_convert do |post|
    noko = Nokogiri::HTML::fragment(post.content)
    noko.css("audio", "div.highlighter-rouge", "figure", "h2", "h3", "p", "video").each_with_index do |tag, index|
        tag[:style] = (tag[:style] || "") + "--stagger: #{index+2};"
        tag[:data_animate] = ""
        if index == 10 then
            break
        end
    end

    post.content = noko.to_html
end