import { Component, OnInit } from '@angular/core'
import { Angular2TokenService } from 'angular2-token'
import { UserProfileService } from './services/user-profile.service'
import { ProgressService } from './services/progress.service'

let pageTemplate = (window as any).mainTemplate || '<div>No template found for app-root!</div>'
// Angular does not support horizontal rules within paragraphs. If it's an empty paragraph, as
// generated by Markdown, it's easy to find and fix. If the paragraph isn't empty, it gets much more
// complex, and this may need to be flagged as a TODO.
// TODO: Move this cleanup to the Markdown postprocessing in Ruby: /lib/markdown.rb
pageTemplate = pageTemplate.replace(/<p><hr\s?\/?><\/p>/, '<hr>')

@Component({
  selector: 'app-root',
  template: pageTemplate,
})
export class AppComponent implements OnInit {
  constructor(
    private _tokenService: Angular2TokenService,
    private userProfileService: UserProfileService,
    private progressService: ProgressService,
  ) {
    this._tokenService.init({
      apiBase: process.env.API_ENDPOINT,
      oAuthBase: process.env.API_ENDPOINT,
      oAuthPaths: {
        github: '/auth/github',
        google: '/auth/google_oauth2',
        twitter: '/auth/twitter',
        linkedin: '/auth/linkedin',
        chef: '/auth/chef_oauth2',
      },
    })
  }

  ngOnInit() {
    this.userProfileService.load(1)
    const win = (window as any)
    this.progressService.start(win.currentPage)
  }

  public isAuthenticated = function(){
    return this._tokenService.userSignedIn()
  }

  public logout  = function(){
    return this._tokenService.signOut()
  }

  public getUserInfo  = function() {
    if (this._tokenService.currentUserData) {
      return this._tokenService.currentUserData
    }
  }
}
