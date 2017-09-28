import React, { Component } from 'react';
import './App.css';
import { listRepos } from './service/getRepos';
import moment from 'moment';
import { Motion, spring } from 'react-motion';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listRepo: undefined,
      viewRepo: false,
      filter: ''
    }
    this.handleViewRepo = this.handleViewRepo.bind(this);
    this.renderListRepo = this.renderListRepo.bind(this);
    this.renderViewRepo = this.renderViewRepo.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  loadRepos() {
    listRepos()
      .then((repos) => {
        console.log('repos in load => ', repos);
        this.setState({
          listRepo: repos
        })
      })
      .catch((error) => {
        console.log('Error in loading repositories: ', error);
      })
  }

  componentWillMount() {
    if (this.state.listRepo) {
      return;
    } else {
      this.loadRepos();
      return;
    }
  }

  getFilteredRepos() {
    let filteredRepos = this.state.listRepo;
    if (filteredRepos) {
      filteredRepos.sort((a, b) => {
        var delta = 0;
        if (a.lastName) {
          delta = a
            .full_name
            .localeCompare(b.full_name);
        }

        if (delta === 0 && a.full_name) {
          delta = a
            .full_name
            .localeCompare(b.full_name);
        }

        return delta;
      });
      if (this.state.filter && this.state.filter.trim().length > 0) {
        let filter = this
          .state
          .filter
          .trim()
          .toLowerCase();
        filteredRepos = filteredRepos.filter((repo) => {
          let full_name = (repo.full_name
            ? repo.full_name.toLowerCase()
            : '');

          if (full_name.indexOf(filter) > -1) {
            return repo;
          }

        });
      }
      return filteredRepos;
    }
  }
  renderListRepo() {
    const listRepo  = this.getFilteredRepos();
    if (listRepo) {
      const scope = this;
      return (
        <div className="listRepos">
          {listRepo.map((repo, index) => {
            const { full_name, updated_at } = repo;
            const name = full_name.split('/').pop();
            const lastUpdate = moment(updated_at).format('YYYY-MM-DD HH:mm');
            return (
              <div key={index} className="repoInList" onClick={() => scope.handleViewRepo(repo)}>
                <div className="repoName">{name}</div>
                <div className="update">Last Updated: {lastUpdate}</div>
              </div>
            )
          })
          }
        </div>
      )
    }
  }

  handleViewRepo(repo) {
    this.setState({
      viewRepo: true,
      selectedRepo: repo
    })
  }

  renderViewRepo() {
    const { selectedRepo, viewRepo } = this.state;
    if (viewRepo && selectedRepo) {
      const { default_branch, forks_count, full_name } = selectedRepo;
      let { language } = selectedRepo;
      if (!language) {
        language = "Not specified";
      }
      return (
        <div className="selectedRepo">
          <div className="name">{full_name.split('/').pop()}</div>
          <div className="language">Language: {language}</div>
          <div className="defaultBranch">Default branch: {default_branch}</div>
          <div className="forks">Forks: {forks_count}</div>
        </div>
      )
    }
  }

  handleFilter(event) {
    this.setState({
      filter: event.target.value
    });
  }
  render() {
    const { viewRepo } = this.state;
    return (
      <div className="App">
        <div className="header">
          <img src="https://samsao.co/wp-content/uploads/2017/02/samsao_logo_blanc-1.png" />
          <input
            className="searchField"
            name="filter"
            placeholder="Search repository..."
            defaultValue={this.state.filter}
            onChange={this.handleFilter} />
        </div>
        <Motion style={{ x: spring(viewRepo ? -200 : 0) }}>
          {({ x }) =>
            <div className="list" style={{
              WebkitTransform: `translate3d(${x}px, 0, 0)`,
              transform: `translate3d(${x}px, 0, 0)`,
            }}>
              {this.renderListRepo()}
            </div>
          }
        </Motion>
        {this.renderViewRepo()}
      </div>
    );
  }
}

export default App;
