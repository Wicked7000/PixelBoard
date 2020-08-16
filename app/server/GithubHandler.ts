import axios from 'axios';

export default class GithubHandler{
    private accessToken: string;
    private fullRepoName: string;

    constructor(accessToken: string, fullRepoName: string){
        this.accessToken = accessToken;
        this.fullRepoName = fullRepoName;

        this.getHeaders = this.getHeaders.bind(this);
    }

    private getHeaders(){
        return {
            headers: {
                Authorization: `token ${this.accessToken}`
            }
        }
    }

    public closeIssue(issue_id: number){
        return axios.patch(`https://api.github.com/repos/${this.fullRepoName}/issues/${issue_id}`,
        {
            state: 'closed',
        },{
            ...this.getHeaders(),
        }        
    );
    }
}