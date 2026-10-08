{{- /* A post as Markdown, at index.md beside its page, for readers and
     tools that would rather have the text than the HTML. Shortcodes are
     rendered (ref gives absolute links), and links and images to the site
     made absolute, so the file reads the same wherever it's fetched to. */ -}}
{{- $site := strings.TrimSuffix "/" site.BaseURL -}}
{{- $body := .RenderShortcodes
  | replaceRE `\]\(/` (printf "](%s/" $site)
  | replaceRE `\]:\s+/` (printf "]: %s/" $site)
  | replaceRE `(src|href)="/` (printf `$1="%s/` $site)
-}}
# {{ .Title }}

{{ with .Description }}> {{ . | plainify | htmlUnescape }}

{{ end -}}
- Author: {{ .Params.author | default site.Params.author }}
- Published: {{ .Date.Format "2006-01-02" }}
{{- if and (not .Lastmod.IsZero) (ne (.Lastmod.Format "2006-01-02") (.Date.Format "2006-01-02")) }}
- Updated: {{ .Lastmod.Format "2006-01-02" }}
{{- end }}
{{- with .GetTerms "categories" }}
- Category: {{ range $i, $t := . }}{{ if $i }}, {{ end }}{{ $t.Title }}{{ end }}
{{- end }}
{{- with .GetTerms "tags" }}
- Tags: {{ range $i, $t := . }}{{ if $i }}, {{ end }}{{ $t.Title }}{{ end }}
{{- end }}
{{- with .GetTerms "series" }}
- Series: {{ (index . 0).Title }}
{{- end }}
- Web page: {{ .Permalink }}

{{ $body | strings.TrimSpace }}
