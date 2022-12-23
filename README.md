# Uncloudy Grapher

A 2.5D graph library to monitor kubernetes' nodes and its pods

---

본 2.5차원 Uncloudy 그래프는 쿠버네티스 노드와 파드를 모니터링하기 위한 그래프 라이브러리입니다.

## Getting started

### Clone this project

```bash
git clone https://github.com/team-grass-farm/uncloudy-graph
cd uncloudy-graph/
yarn
```

### Build this project

```bash
yarn build
```

### Serve this project

```bash
yarn serve
```

## Project members

- See: [Team Members](https://github.com/team-grass-farm/internal-documents/blob/main/meeting-minutes/220522-meeting.md)

## Upgeade packages

```bash
# syncyarnlock 설치
$ yarn global add syncyarnlock

# yarn.lock에서 설치된 버전으로 package.json을 업데이트합니다.
$ syncyarnlock -s -k

# package.json의 현재 버전 제약 조건으로 yarn.lock을 업데이트합니다.
$ yarn install
```
