package problem

import(
	"testing"

	"github.com/stretchr/testify/assert"
)

type Case struct {
}

var cases = []Case{}

func Test_<%= name_slug %>(t *testing.T) {
	for _, cas := range cases {
		result := <%= name_slug %>(?)
		check(t, result, cas)
	}
}

func check(t *testing.T, result ?, cas Case) {
	// Assert
}