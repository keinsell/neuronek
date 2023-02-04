# `effectindex`

`https://effectindex.com` is one of biggest resources when it comes to effects, sadly there is no dataset available and scrapping of website seems to maintain wrong datastructure for our application. There are few solutions for this case.

- Scrape whole website to markdown and put these markdown into `raw_content` field in `Effect`.
- Manually rewrite all of the 233 into TypeScript classes or JSON and keep them in repository for public usage.
