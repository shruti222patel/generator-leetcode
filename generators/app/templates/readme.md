# <%= name %>
<%= description %>

## Examples:
|Input|Output|Explanation|
|-----|------|-----------|<% for (var i = 0; i < examples.length; i++) { %>
|<%= examples[i].input %>|<%= examples[i].output %>|<%= examples[i].explanation %>|<% } %>

## Difficulty
<%= difficulty %>

## Related Topics:
<%= related_topics %>

## Algo


## Takeaway