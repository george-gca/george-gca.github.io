module Jekyll
  class LocalizationExistsTag < Liquid::Tag
    def initialize(tag_name, key, tokens)
      super
      @key = key.strip()
    end

    def render(context)
      content = Liquid::Template.parse(@key).render context
      exists = true
      if !content.include? "." or context.registers[:site].config['translations'] == nil
        exists = false
      end

      current_element = context.registers[:site].config['translations'].first[1]
      splittedKey = content.split('.')

      if exists
        for part in splittedKey do
          if current_element.key?(part)
            current_element = current_element[part]
          else
            exists = false
            break
          end
        end
      end

      "#{exists}"
    end
  end
end

Liquid::Template.register_tag('localization_exists', Jekyll::LocalizationExistsTag)
