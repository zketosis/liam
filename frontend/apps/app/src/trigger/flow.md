<!-- Please update as needed. -->

### Process Flow

#### (Starting Point) Webhook Reception

1. User creates a PR
2. GitHub App sends a webhook to the Liam server
3. In `github/route.ts` on the Liam server, a "save PR information to Supabase" job is queued

--Webhook processing ends here--

#### (Job) Save PR Information to Supabase

savePullRequest

4. The "save PR information to Supabase" job starts
5. Sends API request to save data to Supabase
6. If save is successful, queues the "generate review" job
7. If save fails, logs the error or takes other appropriate actions

--"Save PR information to Supabase" job processing ends here--

#### (Job) Generate Review

generateReview

8. The "generate review" job starts
9. Calls the review generation function to perform the review
10. After review completion, queues the "save review information to Supabase" job

--"Generate review" job processing ends here--

#### (Job) Save Review Information to Supabase

saveReview

11. The "save review information to Supabase" job starts
12. Calls the function to save review information and sends API request to save data to Supabase
13. If save is successful, queues the "post review comment to Pull Request" job
14. If save fails, logs the error or takes other appropriate actions

--"Save review information to Supabase" job processing ends here--

#### (Job) Post Review Comment to Pull Request

postComment

15. The "post review comment to Pull Request" job starts
16. Calls the function to post comments and posts the comment to the Pull Request
17. If posting is successful, the process is complete 
